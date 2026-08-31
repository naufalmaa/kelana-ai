from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from services.trip_services import calculate_daily_budget, get_trip_category, get_transport_recommendation, get_recommended_places, get_travel_season
from services.bedrock_service import get_ai_recommendation
from services.auth_service import (
    register_user,
    authenticate_user,
    get_current_user,
    get_optional_current_user,
    oauth2_scheme,
)
from services.kb_service import ask_knowledge_base
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from database import init_db, SessionLocal, get_db
from models.trips import Trip
from models.users import Users, User

from dotenv import load_dotenv
import os

load_dotenv()

# Pydantic Schemas
class TripRequest(BaseModel):
    destination: str
    country: str
    days: int
    budget: float
    currency: str
    travel_style: str = "Solo"
    trip_theme: Optional[str] = "Cultural & Culinary"
    travel_month: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str

class QuestionRequest(BaseModel):
    question: str


app = FastAPI(title="KelanaAI API", version="1.0.0")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schema & seed accounts
init_db()


@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI API"
    }


@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# -------------------------------------------------------------
# AUTHENTICATION ENDPOINTS (Part 3 & Part 4)
# -------------------------------------------------------------

@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    POST /api/v1/auth/register
    Register a new user. Never stores plain text passwords - hashes them with bcrypt.
    """
    user = register_user(
        db=db,
        name=request.name,
        email=request.email,
        password=request.password,
    )
    return {
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }
    }


@app.post("/api/v1/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    POST /api/v1/auth/login
    Verify user credentials and return a signed JWT access token.
    """
    return authenticate_user(
        db=db,
        email=request.email,
        password=request.password,
    )


@app.get("/api/v1/auth/me")
def get_current_user_profile(
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /api/v1/auth/me
    Returns current authenticated user details and total generated trips count.
    """
    total_trips = db.query(Trip).filter(Trip.users_id == user.id).count()
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at,
        "total_trips": total_trips,
    }


# -------------------------------------------------------------
# STATIC & UTILITY ENDPOINTS
# -------------------------------------------------------------

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


# -------------------------------------------------------------
# PROTECTED TRIP ENDPOINTS (Part 5 & Part 6)
# -------------------------------------------------------------

@app.post("/api/v1/trips")
def create_trip(
    request: TripRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    POST /api/v1/trips
    Creates a new trip belonging to the authenticated user (users_id extracted from JWT).
    """
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
        trip_theme=request.trip_theme,
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
        trip_theme=request.trip_theme or "Cultural & Culinary",
        travel_month=request.travel_month,
        category=category,
        daily_budget=daily_budget,
        users_id=user.id,
        ai_recommendation=ai_recommendation
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)

    return trip


@app.get("/api/v1/trips")
def list_trips(
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /api/v1/trips
    Retrieves all personalized trips created by the currently authenticated user.
    """
    trips = db.query(Trip).filter(Trip.users_id == user.id).order_by(Trip.id.desc()).all()
    return trips


@app.get("/api/v1/trips/{trip_id}")
def get_trip(
    trip_id: int,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /api/v1/trips/{trip_id}
    Retrieves a single trip if owned by the authenticated user.
    Returns 403 Forbidden if the trip belongs to another user.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with id {trip_id} was not found."
        )

    if trip.users_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to access this trip."
        )

    return trip


@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(
    trip_id: int,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    DELETE /api/v1/trips/{trip_id}
    Deletes a trip if owned by the authenticated user.
    Returns 403 Forbidden if the trip belongs to another user.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with id {trip_id} was not found."
        )

    if trip.users_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to delete this trip."
        )

    db.delete(trip)
    db.commit()
    return {"message": f"Trip with id {trip_id} has been deleted successfully."}


@app.put("/api/v1/trips/{trip_id}")
def update_trip(
    trip_id: int,
    request: TripRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    PUT /api/v1/trips/{trip_id}
    Updates an existing trip owned by the authenticated user.
    Returns 403 Forbidden if the trip belongs to another user.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with id {trip_id} was not found."
        )

    if trip.users_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to update this trip."
        )
    
    trip.destination = request.destination
    trip.country = request.country
    trip.days = request.days
    trip.budget = request.budget
    trip.currency = request.currency
    trip.travel_style = request.travel_style
    trip.trip_theme = request.trip_theme or "Cultural & Culinary"
    trip.travel_month = request.travel_month

    trip.category = get_trip_category(request.budget)
    trip.daily_budget = calculate_daily_budget(request.budget, request.days)
    
    trip.ai_recommendation = get_ai_recommendation(
        destination=request.destination,
        country=request.country,
        days=request.days,
        budget=request.budget,
        travel_style=request.travel_style,
        trip_theme=request.trip_theme,
        travel_month=request.travel_month,
        currency=request.currency,
    )
    
    db.commit()
    db.refresh(trip)
    return trip

@app.post("/api/v1/ask")
def ask_endpoint(request: QuestionRequest):
    result = ask_knowledge_base(request.question)

    if isinstance(result, dict):
        return {
            "question": request.question,
            "answer": result.get("answer", ""),
            "source_documents": result.get("source_documents", [])
        }

    return {
        "question": request.question,
        "answer": result,
        "source_documents": []
    }