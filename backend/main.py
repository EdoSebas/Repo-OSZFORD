from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models
import database
import random

app = FastAPI(title="Titanic Seed API")

@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=database.engine)

@app.post("/seed")
def seed_data(db: Session = Depends(database.get_db)):
    # Check if we already have records
    count = db.query(models.Passenger).count()
    if count > 0:
        return {"message": f"Database already seeded with {count} records."}

    # Generate 50 mock records (per user request: haz solo 50)
    records = []
    for i in range(1, 51):
        passenger = models.Passenger(
            survived=random.choice([0, 1]),
            pclass=random.choice([1, 2, 3]),
            name=f"Passenger {i}",
            sex=random.choice(["male", "female"]),
            age=round(random.uniform(1, 80), 1),
            sibsp=random.choice([0, 1, 2]),
            parch=random.choice([0, 1, 2]),
            ticket=f"TKT-{random.randint(1000, 9999)}",
            fare=round(random.uniform(7.0, 150.0), 2),
            cabin=f"C{random.randint(1, 100)}" if random.choice([True, False]) else None,
            embarked=random.choice(["C", "Q", "S"])
        )
        records.append(passenger)
        db.add(passenger)
    
    db.commit()
    return {"message": "Successfully inserted 50 mock records."}

@app.get("/passengers")
def get_passengers(db: Session = Depends(database.get_db), limit: int = 50):
    return db.query(models.Passenger).limit(limit).all()
