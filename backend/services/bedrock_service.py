import os
import json
import re
from typing import Optional, Dict, Any
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
    Configures and initializes the AWS Bedrock Runtime client using API Key / Bearer Token.
    Reads AWS_BEARER_TOKEN_BEDROCK and AWS_REGION from environment if not provided.
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
    # If enclosed in ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if match:
        text = match.group(1).strip()
    return text


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

    prompt = f"""You are an elite, highly knowledgeable travel expert and itinerary architect.
Generate a comprehensive, engaging, and highly practical travel plan for {destination}, {country}.

Trip Parameters:
- Destination: {destination}, {country}
- Duration: {days} days
- Total Budget: {currency} {budget}
- Travel Party / Companion Style: {travel_style} (e.g. Solo, Couple, or Family)
- Trip Theme & Activity Focus: {trip_theme or 'Cultural & Culinary'} (e.g. Cultural & Culinary, Relaxed & Nature, Adventure & Outdoors, Luxury & Sightseeing)
- Travel Month / Season: {travel_month}

Ensure that the itinerary and recommendations are specifically customized for a {travel_style} traveler focusing on {trip_theme or 'Cultural & Culinary'}.

You MUST return your entire output STRICTLY as a single valid JSON object. Do not include any explanations or commentary outside of the JSON.

Expected JSON Structure:
{{
  "trip_overview": "A compelling 2-3 sentence overview highlighting the vibe, season, and charm of {destination} in {travel_month}.",
  "daily_itinerary": [
    {{
      "day": 1,
      "title": "Short title describing the theme of this day",
      "morning": "Detailed morning activity: 2-3 specific sights, scenic walks, or iconic landmarks.",
      "afternoon": "Detailed afternoon activity: cultural sites, local experiences, or immersion.",
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
      "tip": "Important customs, tipping etiquette, and local norms to respect."
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
      "recommended_spot": "Neighborhood, famous market, or restaurant type where locals eat this."
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
        )

        output_message = response.get("output", {}).get("message", {})
        content_list = output_message.get("content", [])
        if content_list and "text" in content_list[0]:
            raw_text = content_list[0]["text"]
            cleaned = clean_json_response(raw_text)
            # Validate that it is valid JSON
            try:
                parsed = json.loads(cleaned)
                return json.dumps(parsed, ensure_ascii=False)
            except Exception:
                return cleaned
        return ""

    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code", "Unknown")
        error_message = e.response.get("Error", {}).get("Message", str(e))
        raise RuntimeError(f"AWS Bedrock ClientError ({error_code}): {error_message}") from e
    except Exception as e:
        raise RuntimeError(f"Failed to get AI recommendation from AWS Bedrock: {str(e)}") from e


# Alias for flexible importing
get_travel_recommendation = get_ai_recommendation