from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from pydantic import BaseModel
import models
import database

class LoginRequest(BaseModel):
    cedula: str
    pin: str

app = FastAPI(title="OSZFORD PreOp API", version="1.0.0")

# ══ CORS ══════════════════════════════════════════
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ══ STARTUP ════════════════════════════════════════
@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=database.engine)

# ══════════════════════════════════════════════════
# LOGIN
# ══════════════════════════════════════════════════

@app.post("/api/login")
def login(request: LoginRequest, db: Session = Depends(database.get_db)):
    cedula = request.cedula
    pin = request.pin
    if not cedula or not pin:
        raise HTTPException(status_code=400, detail="Falta cédula o PIN")
    
    colab = db.query(models.Colaborador).filter(models.Colaborador.cedula == cedula).first()
    
    if not colab:
        raise HTTPException(status_code=401, detail="Colaborador no encontrado")
    
    if colab.pin != pin:
        raise HTTPException(status_code=401, detail="PIN incorrecto")
    
    if colab.estado != "activo":
        raise HTTPException(status_code=403, detail="Colaborador inactivo")
    
    return {
        "success": True,
        "role": colab.rol,
        "nombre": colab.nombre,
        "cedula": cedula,
    }

# ══════════════════════════════════════════════════
# VEHÍCULOS
# ══════════════════════════════════════════════════

@app.get("/api/vehiculos")
def list_vehiculos(db: Session = Depends(database.get_db), tipo: str = None):
    query = db.query(models.Vehiculo)
    if tipo:
        query = query.filter(models.Vehiculo.tipo == tipo)
    return query.all()

@app.post("/api/vehiculos")
def create_vehiculo(
    placa: str,
    tipo: str,
    propiedad: str,
    soat_vence: str = None,
    tecno_vence: str = None,
    db: Session = Depends(database.get_db)
):
    existing = db.query(models.Vehiculo).filter(models.Vehiculo.placa == placa).first()
    if existing:
        raise HTTPException(status_code=400, detail="Placa ya registrada")
    
    veh = models.Vehiculo(
        placa=placa.upper(),
        tipo=tipo,
        propiedad=propiedad,
        soat_vence=datetime.strptime(soat_vence, "%Y-%m-%d").date() if soat_vence else None,
        tecno_vence=datetime.strptime(tecno_vence, "%Y-%m-%d").date() if tecno_vence else None,
    )
    db.add(veh)
    db.commit()
    db.refresh(veh)
    return {"success": True, "vehiculo_id": veh.id, "placa": veh.placa}

@app.get("/api/vehiculos/{placa}")
def get_vehiculo(placa: str, db: Session = Depends(database.get_db)):
    veh = db.query(models.Vehiculo).filter(models.Vehiculo.placa == placa.upper()).first()
    if not veh:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return veh

# ══════════════════════════════════════════════════
# PREOPERACIONAL (INSPECCIÓN)
# ══════════════════════════════════════════════════

@app.post("/api/preoperacional/init")
def init_preoperacional(
    colaborador_cedula: str,
    vehiculo_id: int,
    db: Session = Depends(database.get_db)
):
    colab = db.query(models.Colaborador).filter(
        models.Colaborador.cedula == colaborador_cedula
    ).first()
    if not colab:
        raise HTTPException(status_code=404, detail="Colaborador no encontrado")
    
    veh = db.query(models.Vehiculo).filter(models.Vehiculo.id == vehiculo_id).first()
    if not veh:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    
    preop = models.PreoperacionalRegistro(
        colaborador_id=colab.id,
        vehiculo_id=vehiculo_id,
        tipo_inspeccion="inicio"
    )
    db.add(preop)
    db.commit()
    db.refresh(preop)
    
    return {"preoperacional_id": preop.id}

@app.post("/api/preoperacional/{preop_id}/items")
def add_inspeccion_item(
    preop_id: int,
    parte_nombre: str,
    parte_categoria: str,
    estado: int,
    db: Session = Depends(database.get_db)
):
    preop = db.query(models.PreoperacionalRegistro).filter(
        models.PreoperacionalRegistro.id == preop_id
    ).first()
    if not preop:
        raise HTTPException(status_code=404, detail="Preoperacional no encontrado")
    
    item = models.InspeccionItem(
        preoperacional_id=preop_id,
        parte_nombre=parte_nombre,
        parte_categoria=parte_categoria,
        estado=estado
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return {"item_id": item.id, "estado": estado}

@app.post("/api/preoperacional/{preop_id}/complete")
def complete_preoperacional(
    preop_id: int,
    db: Session = Depends(database.get_db)
):
    preop = db.query(models.PreoperacionalRegistro).filter(
        models.PreoperacionalRegistro.id == preop_id
    ).first()
    if not preop:
        raise HTTPException(status_code=404, detail="Preoperacional no encontrado")
    
    items = db.query(models.InspeccionItem).filter(
        models.InspeccionItem.preoperacional_id == preop_id
    ).all()
    
    red_count = sum(1 for item in items if item.estado == 3)
    yellow_count = sum(1 for item in items if item.estado == 2)
    
    preop.alertas_criticas = red_count
    preop.alertas_warning = yellow_count
    preop.tiene_alertas = red_count > 0
    preop.estado = "completado"
    
    if red_count > 0:
        alert = models.Alerta(
            tipo="inspeccion_critica",
            preoperacional_id=preop_id,
            vehiculo_id=preop.vehiculo_id,
            colaborador_id=preop.colaborador_id,
            titulo=f"⚠️ Inspección: {red_count} defecto(s) crítico(s)",
            descripcion=f"El vehículo {preop.vehiculo.placa} tiene {red_count} elemento(s) en estado ROJO",
            nivel="urgente"
        )
        db.add(alert)
    
    db.commit()
    db.refresh(preop)
    
    return {
        "success": True,
        "preop_id": preop_id,
        "estado": preop.estado,
        "alertas_criticas": preop.alertas_criticas,
        "alertas_warning": preop.alertas_warning
    }

# ══════════════════════════════════════════════════
# JORNADA (TURNO)
# ══════════════════════════════════════════════════

@app.post("/api/jornada/init")
def init_jornada(
    colaborador_cedula: str,
    vehiculo_id: int,
    turno: str,
    puesto: str,
    preoperacional_id: int = None,
    db: Session = Depends(database.get_db)
):
    colab = db.query(models.Colaborador).filter(
        models.Colaborador.cedula == colaborador_cedula
    ).first()
    if not colab:
        raise HTTPException(status_code=404, detail="Colaborador no encontrado")
    
    jornada = models.Jornada(
        colaborador_id=colab.id,
        vehiculo_id=vehiculo_id,
        preoperacional_inicial_id=preoperacional_id,
        fecha=date.today(),
        turno=turno,
        puesto=puesto,
    )
    db.add(jornada)
    db.commit()
    db.refresh(jornada)
    
    return {"jornada_id": jornada.id, "estado": "abierta"}

@app.post("/api/jornada/{jornada_id}/km")
def record_km(
    jornada_id: int,
    km_inicial: float = None,
    km_final: float = None,
    novedades: str = None,
    db: Session = Depends(database.get_db)
):
    jornada = db.query(models.Jornada).filter(models.Jornada.id == jornada_id).first()
    if not jornada:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")
    
    if km_inicial:
        jornada.km_inicial = km_inicial
    if km_final:
        jornada.km_final = km_final
        jornada.km_recorridos = km_final - (jornada.km_inicial or 0)
    if novedades:
        jornada.novedades = novedades
    
    db.commit()
    db.refresh(jornada)
    
    return {
        "jornada_id": jornada_id,
        "km_inicial": jornada.km_inicial,
        "km_final": jornada.km_final,
        "km_recorridos": jornada.km_recorridos
    }

@app.post("/api/jornada/{jornada_id}/close")
def close_jornada(jornada_id: int, db: Session = Depends(database.get_db)):
    jornada = db.query(models.Jornada).filter(models.Jornada.id == jornada_id).first()
    if not jornada:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")
    
    jornada.estado = "cerrada"
    jornada.hora_cierre = datetime.utcnow()
    
    if jornada.vehiculo and jornada.km_recorridos:
        jornada.vehiculo.km_acumulado += jornada.km_recorridos
    
    db.commit()
    db.refresh(jornada)
    
    return {
        "jornada_id": jornada_id,
        "estado": "cerrada",
        "km_recorridos": jornada.km_recorridos
    }

# ══════════════════════════════════════════════════
# DASHBOARD (Supervisor)
# ══════════════════════════════════════════════════

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    today = date.today()
    
    total_jornadas = db.query(models.Jornada).filter(
        models.Jornada.fecha == today
    ).count()
    
    completed = db.query(models.Jornada).filter(
        models.Jornada.fecha == today,
        models.Jornada.estado == "cerrada"
    ).count()
    
    active_alerts = db.query(models.Alerta).filter(
        models.Alerta.resuelta == False
    ).count()
    
    urgent_alerts = db.query(models.Alerta).filter(
        models.Alerta.resuelta == False,
        models.Alerta.nivel == "urgente"
    ).count()
    
    total_km = db.query(func.sum(models.Jornada.km_recorridos)).filter(
        models.Jornada.fecha == today
    ).scalar() or 0
    
    return {
        "inspecciones_hoy": completed,
        "total_esperado": total_jornadas,
        "cumplimiento": f"{(completed/total_jornadas*100) if total_jornadas > 0 else 0:.1f}%",
        "alertas_activas": active_alerts,
        "alertas_urgentes": urgent_alerts,
        "km_flota_hoy": round(total_km, 1),
    }

@app.get("/api/dashboard/colaboradores")
def get_colaboradores_status(db: Session = Depends(database.get_db)):
    today = date.today()
    colaboradores = db.query(models.Colaborador).all()
    
    result = []
    for colab in colaboradores:
        jornada = db.query(models.Jornada).filter(
            models.Jornada.colaborador_id == colab.id,
            models.Jornada.fecha == today
        ).order_by(models.Jornada.hora_inicio.desc()).first()
        
        status = "Sin registro"
        if jornada:
            if jornada.estado == "cerrada":
                status = "✓ Completo"
            else:
                status = "⏳ Parcial"
        
        result.append({
            "nombre": colab.nombre,
            "cedula": colab.cedula,
            "estado": status,
        })
    
    return result

@app.get("/api/dashboard/alertas")
def get_alertas(nivel: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Alerta).filter(models.Alerta.resuelta == False)
    if nivel:
        query = query.filter(models.Alerta.nivel == nivel)
    return query.order_by(models.Alerta.fecha_creacion.desc()).all()

# ══════════════════════════════════════════════════
# HEALTH CHECK
# ══════════════════════════════════════════════════

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}