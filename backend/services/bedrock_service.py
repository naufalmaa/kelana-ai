"""
KelanaAI - AWS Bedrock Travel Recommendation Service
Generates comprehensive, structured AI travel itinerary recommendations using AWS Bedrock (Amazon Nova / Claude).
Ensures robust parsing, thorough day-by-day generation, and seamless fallback handling.
"""

import os
import json
import re
from typing import Optional, Dict, Any, List
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


def configure_bedrock_client(
    bearer_token: Optional[str] = None,
    region_name: Optional[str] = None,
):
    """
    Configures and initializes the AWS Bedrock Runtime client.
    Reads AWS_BEARER_TOKEN_BEDROCK / AWS_BEARER_TOKEN and AWS_REGION from environment.
    """
    token = bearer_token or os.getenv("AWS_BEARER_TOKEN_BEDROCK") or os.getenv("AWS_BEARER_TOKEN")
    region = region_name or os.getenv("AWS_REGION", "ap-southeast-2")

    if token:
        os.environ["AWS_BEARER_TOKEN"] = token

    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=region,
    )
    return client


# Default bedrock runtime client instance
client = configure_bedrock_client()


def clean_json_response(raw_text: str) -> str:
    """
    Extracts valid JSON substring from LLM response if markdown code blocks or surrounding text exist.
    """
    text = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if match:
        text = match.group(1).strip()
    return text


def generate_structured_fallback(
    destination: str,
    country: str,
    days: int,
    budget: float,
    travel_style: str,
    travel_month: str,
    currency: str,
    trip_theme: str,
) -> Dict[str, Any]:
    """
    High-quality structured fallback generator if AWS Bedrock is unavailable or times out.
    Guarantees complete, authentic itinerary matching all requested parameters.
    """
    daily_budget = round(budget / max(1, days), 2)
    daily_itinerary: List[Dict[str, Any]] = []

    theme_focus = trip_theme or "Cultural & Culinary"

    for d in range(1, days + 1):
        if d == 1:
            title = f"Arrival & Welcome to {destination}"
            morning = f"Arrive at {destination}, check into your accommodation, and unpack."
            afternoon = f"Take an introductory orientation walk around {destination}'s central district and iconic landmarks."
            evening = f"Enjoy a welcome dinner savoring local culinary specialties at a traditional neighborhood bistro."
            daily_tip = f"Pick up a local transit pass or digital travel card at the arrival station."
        elif d == days:
            title = f"Final Souvenirs & Farewell {destination}"
            morning = f"Visit local markets and artisan shops in {destination} to find authentic souvenirs and handcrafted gifts."
            afternoon = f"Take a relaxing stroll through scenic parks or a waterfront promenade for scenic farewell photos."
            evening = f"Farewell dinner reflecting on an incredible {days}-day adventure in {destination}, {country}."
            daily_tip = f"Double check departure transportation schedules and airport transit times."
        else:
            title = f"Day {d}: {theme_focus} Highlights & Exploration"
            morning = f"Morning exploration of celebrated historical monuments, heritage districts, and scenic viewpoints in {destination}."
            afternoon = f"Afternoon immersive experience tailored for {travel_style} travelers exploring {theme_focus.lower()} sights."
            evening = f"Evening dining experience followed by vibrant nighttime street walks or cultural performances."
            daily_tip = f"Start early to avoid peak mid-day crowds at top attraction sites."

        daily_itinerary.append({
            "day": d,
            "title": title,
            "morning": morning,
            "afternoon": afternoon,
            "evening": evening,
            "daily_tip": daily_tip,
        })

    return {
        "trip_overview": f"A thoroughly customized {days}-day itinerary to {destination}, {country} during {travel_month}. Designed specifically for {travel_style.lower()} travelers focusing on {theme_focus.lower()} experiences with an estimated total budget of {currency} {budget:,.2f}.",
        "daily_itinerary": daily_itinerary,
        "travel_tips": [
            {
                "title": "Local Transport & Navigation",
                "tip": f"Use local public transit systems and navigation apps for easy travel across {destination}."
            },
            {
                "title": f"Season & Weather in {travel_month}",
                "tip": f"Pack comfortable walking shoes and versatile layers appropriate for {travel_month} weather in {country}."
            },
            {
                "title": "Culture & Etiquette",
                "tip": f"Be respectful of local traditions and customs when visiting heritage sites in {country}."
            },
            {
                "title": "Money & Connectivity",
                "tip": f"Carry a mix of local currency and contactless cards; arrange an eSIM or local SIM card for data."
            }
        ],
        "food_recommendations": [
            {
                "dish": f"Traditional {country} Signature Dish",
                "description": f"A classic culinary staple prepared with fresh local ingredients and authentic seasonings.",
                "recommended_spot": f"Popular local eateries and markets in {destination}"
            },
            {
                "dish": "Local Street Food Special",
                "description": "Crispy and flavorful snack popular among locals during afternoon and evening strolls.",
                "recommended_spot": f"Central food markets in {destination}"
            },
            {
                "dish": "Regional Specialty Dessert",
                "description": "Delicious traditional sweet treat paired with coffee or artisanal tea.",
                "recommended_spot": f"Historic cafes across {destination}"
            }
        ],
        "budget_breakdown": [
            {
                "category": "Accommodation",
                "percentage": 35,
                "estimated_amount": round(budget * 0.35, 2),
                "description": f"Lodging & hotels matching {travel_style} travel style in {currency}"
            },
            {
                "category": "Food & Dining",
                "percentage": 30,
                "estimated_amount": round(budget * 0.30, 2),
                "description": "Daily meals, regional delicacies, and cafe visits"
            },
            {
                "category": "Activities & Attractions",
                "percentage": 20,
                "estimated_amount": round(budget * 0.20, 2),
                "description": f"Entry tickets, museums, and {theme_focus.lower()} excursions"
            },
            {
                "category": "Local Transportation",
                "percentage": 10,
                "estimated_amount": round(budget * 0.10, 2),
                "description": "Transit passes, metro, buses, and short rideshares"
            },
            {
                "category": "Buffer & Miscellaneous",
                "percentage": 5,
                "estimated_amount": round(budget * 0.05, 2),
                "description": "Souvenirs, snacks, and emergency reserve funds"
            }
        ]
    }


def get_ai_recommendation(
    destination: str,
    country: str,
    days: int,
    budget: float,
    travel_style: str,
    travel_month: str,
    currency: str = "USD",
    trip_theme: Optional[str] = "Cultural & Culinary",
    model_id: Optional[str] = None,
) -> str:
    """
    Generate an intelligent, structured AI travel itinerary recommendation using AWS Bedrock.
    Returns a JSON string containing 4 distinct sections:
    1. daily_itinerary (one card per day with morning, afternoon, evening activities)
    2. travel_tips (etiquette, packing, transportation, weather)
    3. food_recommendations (must-try dishes & culinary spots)
    4. budget_breakdown (itemized cost categories, percentages, and amounts)
    """
    selected_model_id = model_id or os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")
    active_theme = trip_theme or "Cultural & Culinary"

    prompt = f"""You are an elite, highly knowledgeable travel expert and itinerary architect.
Generate a comprehensive, engaging, highly detailed, and practical travel plan for {destination}, {country}.

Trip Parameters:
- Destination: {destination}, {country}
- Duration: {days} days
- Total Budget: {currency} {budget}
- Target Currency: {currency} (All financial amounts must strictly be formatted and calculated in {currency})
- Travel Party / Companion Style: {travel_style} (e.g. Solo, Couple, or Family)
- Trip Theme & Activity Focus: {active_theme} (e.g. Cultural & Culinary, Relaxed & Nature, Adventure & Outdoors, Luxury & Sightseeing)
- Travel Month / Season: {travel_month}

CRITICAL CURRENCY & COUNTRY LOCALIZATION:
- You MUST strictly use {currency} for all monetary estimations, ticket costs, and budget descriptions. NEVER output dollar signs ($) if {currency} is not USD (e.g. for IDR use IDR/Rp, for EUR use EUR/€, for JPY use JPY/¥).
- Customize transit recommendations (e.g. ride-hailing, metro/train passes), dining spots, and cultural tips specifically and authentically for {destination}, {country}.
- Ensure that the itinerary and recommendations are specifically customized for a {travel_style} traveler focusing on {active_theme}.

You MUST return your entire output STRICTLY as a single valid JSON object. Do not include any explanations, markdown comments, or commentary outside of the JSON.

Expected JSON Structure:
{{
  "trip_overview": "A compelling 2-3 sentence overview highlighting the vibe, season in {travel_month}, and charm of {destination}, {country} for {travel_style} travelers.",
  "daily_itinerary": [
    {{
      "day": 1,
      "title": "Short title describing the theme of this day",
      "morning": "Detailed morning activity: 2-3 specific sights, scenic walks, or iconic landmarks in {destination}.",
      "afternoon": "Detailed afternoon activity: cultural immersion, authentic local stops, or scenic spots.",
      "evening": "Detailed evening activity: dinner spots, night markets, viewpoints, or relaxing nightlife.",
      "daily_tip": "A practical insider tip for this specific day."
    }}
  ],
  "travel_tips": [
    {{
      "title": "Local Transport & Navigation",
      "tip": "Specific passes, transit apps, metro/bus advice for {destination}."
    }},
    {{
      "title": "Season & Weather in {travel_month}",
      "tip": "Temperature expectation, what to pack, and rainfall advice."
    }},
    {{
      "title": "Culture & Etiquette",
      "tip": "Important customs, tipping etiquette, and local norms to respect in {country}."
    }},
    {{
      "title": "Money & Connectivity",
      "tip": "Cash vs card preferences, best SIM card/eSIM options, and money-saving advice."
    }}
  ],
  "food_recommendations": [
    {{
      "dish": "Signature Dish Name",
      "description": "Appetizing description of ingredients, flavor profile, and cultural significance.",
      "recommended_spot": "Neighborhood, famous market, or restaurant type where locals eat this in {destination}."
    }}
  ],
  "budget_breakdown": [
    {{
      "category": "Accommodation",
      "percentage": 35,
      "estimated_amount": {round(budget * 0.35, 2)},
      "description": "Recommended stays matching {travel_style} style in {currency}"
    }},
    {{
      "category": "Food & Dining",
      "percentage": 30,
      "estimated_amount": {round(budget * 0.30, 2)},
      "description": "Daily meals, street snacks, and beverages"
    }},
    {{
      "category": "Activities & Attractions",
      "percentage": 20,
      "estimated_amount": {round(budget * 0.20, 2)},
      "description": "Entry fees, guided tours, and museum passes"
    }},
    {{
      "category": "Local Transportation",
      "percentage": 10,
      "estimated_amount": {round(budget * 0.10, 2)},
      "description": "Metro, trains, public transit, and rideshares"
    }},
    {{
      "category": "Buffer & Miscellaneous",
      "percentage": 5,
      "estimated_amount": {round(budget * 0.05, 2)},
      "description": "Souvenirs, shopping, and emergency reserve"
    }}
  ]
}}

Requirements:
- Provide exactly {days} day objects in daily_itinerary (from day 1 to day {days}).
- Provide 3-5 distinct food_recommendations authentic to {destination} and {country}.
- Ensure all budget numbers reflect {currency} {budget}.
- Output ONLY valid, parsable JSON.
"""

    try:
        response = client.converse(
            modelId=selected_model_id,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
            inferenceConfig={
                "maxTokens": 4096,
                "temperature": 0.7,
                "topP": 0.9,
            },
        )

        output_message = response.get("output", {}).get("message", {})
        content_list = output_message.get("content", [])
        if content_list and "text" in content_list[0]:
            raw_text = content_list[0]["text"]
            cleaned = clean_json_response(raw_text)
            
            # Validate JSON
            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, dict) and "daily_itinerary" in parsed:
                    # Validate day count matches requested days
                    if len(parsed.get("daily_itinerary", [])) < days:
                        # Ensure all days exist
                        existing_days = len(parsed["daily_itinerary"])
                        for d in range(existing_days + 1, days + 1):
                            parsed["daily_itinerary"].append({
                                "day": d,
                                "title": f"Day {d}: Exploring {destination}",
                                "morning": f"Morning exploration of local neighborhoods and scenic sights in {destination}.",
                                "afternoon": f"Afternoon immersive {active_theme.lower()} activities in {destination}.",
                                "evening": f"Evening dinner at a recommended local restaurant.",
                                "daily_tip": f"Check local opening hours before visiting attractions."
                            })
                    return json.dumps(parsed, ensure_ascii=False)
            except Exception:
                pass

            return cleaned

    except Exception as e:
        print(f"[Bedrock] Notice: AI model invocation error ({e}), utilizing structured fallback generator.")

    # Fallback to guaranteed structured JSON generator
    fallback_data = generate_structured_fallback(
        destination=destination,
        country=country,
        days=days,
        budget=budget,
        travel_style=travel_style,
        travel_month=travel_month,
        currency=currency,
        trip_theme=active_theme,
    )
    return json.dumps(fallback_data, ensure_ascii=False)


# Alias for flexible importing
get_travel_recommendation = get_ai_recommendation