import os
from typing import Optional
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


def get_ai_recommendation(
    destination: str,
    country: str,
    days: int,
    budget: float,
    travel_style: str,
    travel_month: str,
    model_id: Optional[str] = None,
) -> str:
    """
    Generate an AI travel itinerary recommendation using AWS Bedrock.

    Format your response as Markdown with Headers (##) and bullet lists (-).

    Here are the list that must be available on the plan:
    1. Daily Itinerary
    2. Estimated Daily Budget
    3. Local Food Recommendations
    4. Transportation & Accomodation Suggestions

    Prompt format:
    You are an experienced travel planner. Plan a {days}-day itenerary for {destination} in {country}.
    "Budget: USD {budget}\n"
    "Travel Style: {travel_style}\n"
    "Travel Month: {travel_month}\n"
    """
    selected_model_id = model_id or os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

    prompt = (
        f"You are an experienced travel planner. Plan a {days}-day itenerary for {destination} in {country}. \n"
        f"Budget: USD {budget}\n"
        f"Travel Style: {travel_style}\n"
        f"Travel Month: {travel_month}\n"
    )

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
            return content_list[0]["text"]
        return ""

    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code", "Unknown")
        error_message = e.response.get("Error", {}).get("Message", str(e))
        raise RuntimeError(f"AWS Bedrock ClientError ({error_code}): {error_message}") from e
    except Exception as e:
        raise RuntimeError(f"Failed to get AI recommendation from AWS Bedrock: {str(e)}") from e


# Alias for flexible importing
get_travel_recommendation = get_ai_recommendation