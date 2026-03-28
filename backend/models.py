from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# ══ COLABORADOR (Empleado/Usuario) ══════════════════
class Colaborador(Base):
    __tablename__ = "colaboradores"
    
    id = Column(Integer, primary_key=True, index=True)
    cedula = Column(String(20), unique=True, index=True)
    pin = Column(String(4))
    nombre = Column(String(255))
    rol = Column(String(50))  # "colab" o "super"
    estado = Column(String(50), default="activo")
    turno_default = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    jornadas = relationship("Jornada", back_populates="colaborador")
    inspeccionadas = relationship("PreoperacionalRegistro", back_populates="colaborador")


# ══ VEHÍCULO ═════════════════════════════════════════
class Vehiculo(Base):
    __tablename__ = "vehiculos"
    
    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String(10), unique=True, index=True)
    tipo = Column(String(50))  # "moto", "elec", "bici", "pat"
    propiedad = Column(String(50))  # "propio", "empresa"
    propietario_cedula = Column(String(20), nullable=True)
    
    soat_vence = Column(Date, nullable=True)
    tecno_vence = Column(Date, nullable=True)
    
    km_acumulado = Column(Float, default=0.0)
    estado = Column(String(50), default="operativo")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    preoperacionales = relationship("PreoperacionalRegistro", back_populates="vehiculo")
    jornadas = relationship("Jornada", back_populates="vehiculo")


# ══ PREOPERACIONAL ═══════════════════════════════════
class PreoperacionalRegistro(Base):
    __tablename__ = "preoperacional_registros"
    
    id = Column(Integer, primary_key=True, index=True)
    colaborador_id = Column(Integer, ForeignKey("colaboradores.id"))
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"))
    
    fecha = Column(DateTime, default=datetime.utcnow)
    tipo_inspeccion = Column(String(50))  # "inicio", "rutina", "final"
    
    tiene_alertas = Column(Boolean, default=False)
    alertas_criticas = Column(Integer, default=0)
    alertas_warning = Column(Integer, default=0)
    
    estado = Column(String(50), default="pendiente")  # pendiente, completado, rechazado
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    colaborador = relationship("Colaborador", back_populates="inspeccionadas")
    vehiculo = relationship("Vehiculo", back_populates="preoperacionales")
    items = relationship("InspeccionItem", back_populates="preoperacional", cascade="all, delete-orphan")


# ══ INSPECTION ITEM ══════════════════════════════════
class InspeccionItem(Base):
    __tablename__ = "inspeccion_items"
    
    id = Column(Integer, primary_key=True, index=True)
    preoperacional_id = Column(Integer, ForeignKey("preoperacional_registros.id"))
    
    parte_nombre = Column(String(255))
    parte_categoria = Column(String(100))
    
    # 0 = no revisado, 1 = verde (bueno), 2 = amarillo (deteriorado), 3 = rojo (malo)
    estado = Column(Integer, default=0)
    
    foto_url = Column(String(500), nullable=True)
    foto_timestamp = Column(DateTime, nullable=True)
    
    preoperacional = relationship("PreoperacionalRegistro", back_populates="items")


# ══ JORNADA (Turno) ══════════════════════════════════
class Jornada(Base):
    __tablename__ = "jornadas"
    
    id = Column(Integer, primary_key=True, index=True)
    colaborador_id = Column(Integer, ForeignKey("colaboradores.id"))
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"))
    preoperacional_inicial_id = Column(Integer, ForeignKey("preoperacional_registros.id"), nullable=True)
    
    fecha = Column(Date, index=True)
    turno = Column(String(50))  # "diurno", "nocturno"
    puesto = Column(String(100))  # "Sede Norte", "Sede Sur"
    
    km_inicial = Column(Float, nullable=True)
    km_final = Column(Float, nullable=True)
    km_recorridos = Column(Float, nullable=True)
    
    foto_odometro_ini_url = Column(String(500), nullable=True)
    foto_odometro_fin_url = Column(String(500), nullable=True)
    
    novedades = Column(Text, nullable=True)
    
    estado = Column(String(50), default="abierta")  # abierta, cerrada
    hora_inicio = Column(DateTime, default=datetime.utcnow)
    hora_cierre = Column(DateTime, nullable=True)
    
    colaborador = relationship("Colaborador", back_populates="jornadas")
    vehiculo = relationship("Vehiculo", back_populates="jornadas")


# ══ ALERTA ═══════════════════════════════════════════
class Alerta(Base):
    __tablename__ = "alertas"
    
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50))  # "soat_vencido", "inspeccion_critica", etc
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"), nullable=True)
    colaborador_id = Column(Integer, ForeignKey("colaboradores.id"), nullable=True)
    preoperacional_id = Column(Integer, ForeignKey("preoperacional_registros.id"), nullable=True)
    
    titulo = Column(String(255))
    descripcion = Column(Text)
    nivel = Column(String(50))  # "urgente", "proximo", "info"
    
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_resolucion = Column(DateTime, nullable=True)
    resuelta = Column(Boolean, default=False)