from database import SessionLocal, engine
import models
from datetime import datetime, timedelta, date

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()


# Limpiar datos existentes para re-seed
#db.query(models.Alerta).delete()
#db.query(models.InspeccionItem).delete()
#db.query(models.Jornada).delete()
#db.query(models.PreoperacionalRegistro).delete()
#db.query(models.Vehiculo).delete()
#db.query(models.Colaborador).delete()
#db.commit()
#print("🗑️  Datos anteriores eliminados")

# Crear 30 colaboradores.
colaboradores = [   
    models.Colaborador(cedula="1005123456", pin="1234", nombre="Carlos Torres", rol="colab"),
    models.Colaborador(cedula="1005654321", pin="5678", nombre="Maria Lopez", rol="colab"),
    models.Colaborador(cedula="1005000111", pin="9999", nombre="Admin User", rol="super"),
    models.Colaborador(cedula="1005111222", pin="1111", nombre="Juan Perez", rol="colab"),
    models.Colaborador(cedula="1005222333", pin="2222", nombre="Sandra Gomez", rol="colab"),
    models.Colaborador(cedula="1005333444", pin="3333", nombre="Luis Rodriguez", rol="colab"),
    models.Colaborador(cedula="1005444555", pin="4444", nombre="Ana Martinez", rol="colab"),
    models.Colaborador(cedula="1005555666", pin="5555", nombre="Pedro Sanchez", rol="colab"),
    models.Colaborador(cedula="1005666777", pin="6666", nombre="Maria Garcia", rol="colab"),
    models.Colaborador(cedula="1005777888", pin="7777", nombre="Carlos Vargas", rol="colab"),
    models.Colaborador(cedula="1005888999", pin="8888", nombre="Diana Castillo", rol="colab"),
    models.Colaborador(cedula="1005999000", pin="9999", nombre="Roberto Silva", rol="colab"),
    models.Colaborador(cedula="1006000111", pin="1234", nombre="Natalia Reyes", rol="colab"),
    models.Colaborador(cedula="1006111222", pin="5678", nombre="Fernando Lopez", rol="colab"),
    models.Colaborador(cedula="1006222333", pin="1111", nombre="Silvia Ramirez", rol="colab"),
    models.Colaborador(cedula="1006333444", pin="2222", nombre="Gabriel Hernandez", rol="colab"),
    models.Colaborador(cedula="1006444555", pin="3333", nombre="Claudia Moreno", rol="colab"),
    models.Colaborador(cedula="1006555666", pin="4444", nombre="Ricardo Flores", rol="colab"),
    models.Colaborador(cedula="1006666777", pin="5555", nombre="Valentina Ruiz", rol="colab"),
    models.Colaborador(cedula="1006777888", pin="6666", nombre="Andres Castro", rol="colab"),
    models.Colaborador(cedula="1006888999", pin="7777", nombre="Mariana Diaz", rol="colab"),
    models.Colaborador(cedula="1006999000", pin="8888", nombre="Sergio Medina", rol="colab"),
    models.Colaborador(cedula="1007000111", pin="1234", nombre="Patricia Soto", rol="colab"),
    models.Colaborador(cedula="1007111222", pin="5678", nombre="Miguel Paredes", rol="colab"),
    models.Colaborador(cedula="1007222333", pin="1111", nombre="Lorena Gutierrez", rol="colab"),
    models.Colaborador(cedula="1007333444", pin="2222", nombre="Hector Romero", rol="colab"),
    models.Colaborador(cedula="1007444555", pin="3333", nombre="Gabriela Navarro", rol="colab"),
    models.Colaborador(cedula="1007555666", pin="4444", nombre="Felipe Herrera", rol="colab"),
    models.Colaborador(cedula="1007666777", pin="5555", nombre="Camila Ortiz", rol="colab"),
    models.Colaborador(cedula="1007777888", pin="6666", nombre="Javier Contreras", rol="colab"),
]

for colab in colaboradores:
    db.add(colab)

db.commit()

# Crear 10 vehículos.
vehicles = [
    models.Vehiculo(placa="EKT291", tipo="moto", propiedad="propio", soat_vence=date.today() + timedelta(days=180)),
    models.Vehiculo(placa="XYZ789", tipo="moto", propiedad="empresa", soat_vence=date.today() + timedelta(days=90)),
    models.Vehiculo(placa="DEF456", tipo="bici", propiedad="propio"),
    models.Vehiculo(placa="GHI012", tipo="pat", propiedad="empresa"),
    models.Vehiculo(placa="JKL345", tipo="elec", propiedad="propio"),
    models.Vehiculo(placa="MNO678", tipo="moto", propiedad="empresa"),
    models.Vehiculo(placa="PQR901", tipo="moto", propiedad="propio"),
    models.Vehiculo(placa="STU234", tipo="bici", propiedad="empresa"),
    models.Vehiculo(placa="VWX567", tipo="pat", propiedad="propio"),
    models.Vehiculo(placa="YZA890", tipo="elec", propiedad="empresa"),
]

for veh in vehicles:
    db.add(veh)

db.commit()
print("✅ Base de datos con 30 colaboradores y 10 vehículos creada!")