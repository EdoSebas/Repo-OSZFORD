from sqlalchemy import Column, Integer, String, Float
from database import Base

class Passenger(Base):
    __tablename__ = "passengers"

    id = Column(Integer, primary_key=True, index=True)
    survived = Column(Integer)
    pclass = Column(Integer)
    name = Column(String(255))
    sex = Column(String(50))
    age = Column(Float, nullable=True)
    sibsp = Column(Integer)
    parch = Column(Integer)
    ticket = Column(String(100))
    fare = Column(Float)
    cabin = Column(String(50), nullable=True)
    embarked = Column(String(10))
