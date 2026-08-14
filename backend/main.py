from services.trip_services import calculate_daily_budget, get_trip_category, get_transport_recommendation, get_recommended_places, get_travel_season
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel

# """
# KelanaAI - Trip Summary Generator
# Sesi 3: Basis API Dengan RESTful & FastAPI
# """

class TripRequest (BaseModel):

    destination: List[str]
    country: str
    days: int
    budget: float
    currency: str
    travel_style: str
    travel_month: str

app = FastAPI()

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

@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    destination = request.destination
    country = request.country
    days = request.days
    budget = request.budget
    currency = request.currency
    travel_month = request.travel_month
    travel_style = request.travel_style
    daily_budget = calculate_daily_budget(budget, days)
    trip_category = get_trip_category(budget)
    transport = get_transport_recommendation(trip_category)
    travel_season = get_travel_season(travel_month)
    
    places_list = []
    for i in destination:
        places_list.append({"destination": i, "places": get_recommended_places(i)})
    
    return {
        "destination": destination,
        "country": country,
        "days": days,
        "budget": budget,
        "currency": currency,
        "travel_month": travel_month,
        "travel_style": travel_style,
        "travel_season": travel_season,
        "daily_budget": daily_budget,
        "trip_category": trip_category,
        "recommended_transportation": transport,
        "recommended_places": places_list,
    }
