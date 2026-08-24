from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.trip_services import calculate_daily_budget, get_trip_category, get_transport_recommendation, get_recommended_places, get_travel_season
from services.bedrock_service import get_ai_recommendation
from typing import List
from pydantic import BaseModel
from database import init_db, SessionLocal
from models.trips import Trip

# """
# KelanaAI - Trip Summary Generator
# Sesi 4: Integrasi FastAPI dengan Database PostgreSQL
# """

class TripRequest (BaseModel):

    destination: str
    country: str
    days: int
    budget: float
    currency: str
    travel_style: str
    travel_month: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

@app.get("/")
def home():
    return {
        "message":"Welcome to KelanaAI"
    }

@app.get("/health")
def health():
    return {
        "status":"OK"
    }

@app.get("/api/v1/trip_categories")
def trip_categories():
    return [
        "Backpacker",
        "Standard",
        "Luxury"
    ]

@app.get("/api/v1/recommendations")
def recommendations():
    return [
        "Tokyo Tower", "Mount Fuji", "Shibuya"
    ]

@app.get("/api/v1/transportations")
def transportations():
    return [
        "Bus", "Train", "Flight"
    ]

@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    days = request.days
    budget = request.budget
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)

    ai_recommendation = get_ai_recommendation(
        destination=request.destination,
        country=request.country,
        days=days,
        budget=budget,
        travel_style=request.travel_style,
        travel_month=request.travel_month,
        currency=request.currency,
    )

    trip = Trip(
        destination=request.destination,
        country=request.country,
        days=days,
        budget=budget,
        currency=request.currency,
        travel_style=request.travel_style,
        travel_month=request.travel_month,
        category=category,
        daily_budget=daily_budget,
        ai_recommendation=ai_recommendation
    )

    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return trip

@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()
    return trips


@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()
    # handling not found
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} is not found")
    return trip

@app.post("/api/v1/trips/{trip_id}/generate")
def create_trip_ai(request: TripRequest, trip_id: int):
    days = request.days
    budget = request.budget
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)

    ai_recommendation = get_ai_recommendation(
        destination=request.destination,
        country=request.country,
        days=days,
        budget=budget,
        travel_style=request.travel_style,
        travel_month=request.travel_month,
        currency=request.currency,
    )

    trip = Trip(
        id=trip_id,
        destination=request.destination,
        country=request.country,
        days=days,
        budget=budget,
        currency=request.currency,
        travel_style=request.travel_style,
        travel_month=request.travel_month,
        category=category,
        daily_budget=daily_budget,
        ai_recommendation=ai_recommendation
    )

    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return trip

@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    # handling not found
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} is not found")

    db.delete(trip)
    db.commit()
    db.close()

    return trip


@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripRequest):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} is not found")
    
    trip.destination = request.destination
    trip.country = request.country
    trip.days = request.days
    trip.budget = request.budget
    trip.currency = request.currency
    trip.travel_style = request.travel_style
    trip.travel_month = request.travel_month

    trip.category = get_trip_category(request.budget)
    trip.daily_budget = calculate_daily_budget(request.budget, request.days)
    
    db.commit()
    db.refresh(trip)
    db.close()
    return trip