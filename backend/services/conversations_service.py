"""
KelanaAI - Conversation & Message Orchestration Service
Handles 7-step message lifecycle, context-aware prompt building, Amazon Bedrock invocation,
and sliding-window history management.
"""

import os
import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.conversations import Conversation, Message
from models.users import Users
from services.bedrock_service import client as bedrock_client

SYSTEM_PROMPT = """You are KelanaAI, an elite, world-class AI travel consultant and master itinerary architect.
Your mission is to help travelers discover, plan, and optimize unforgettable journeys around the globe.

CRITICAL INSTRUCTIONS FOR VIBRANT, EYE-CATCHING RESPONSES:
Structure every response using rich, beautiful GitHub-flavored Markdown (GFM) with maximum visual appeal and clarity:

1. 🌟 Dynamic Headers & Themes:
   - Use clear hierarchical headings with relevant emojis (e.g., `# 🌴 10-Day Caribbean Sea Adventure Itinerary`, `## 💰 Estimated Budget Breakdown`, `## 🗺️ Daily Action Plan & Highlights`).
   - Use horizontal dividers (`---`) between major sections to give the itinerary a clean, magazine-style layout.

2. 📊 Formatted GFM Tables (MUST USE for Budgets, Pacing, or Comparisons):
   - Whenever discussing budgets, accommodation options, transit choices, or day-by-day cost estimations, ALWAYS provide a clean, beautifully formatted Markdown table:
   | Category | Estimated Cost | Recommended Option & Highlights |
   | :--- | :--- | :--- |
   | 🏨 Accommodation | $800 ($80/night) | Budget-friendly boutique hotels / beachside Airbnbs |
   | ✈️ Transit & Ferries | $450 | Inter-island flights, airport transfers & ferry passes |
   | 🍤 Food & Dining | $450 ($45/day) | Authentic local fondas, seafood kiosks & food trucks |
   | 🎟️ Tours & Activities | $200 | Coral reef snorkeling, rainforest entry & historical forts |
   | 🛡️ Reserve & Souvenirs | $100 | Emergency buffer, island craft souvenirs |
   | **Total Plan** | **$2,000 USD** | **100% Within Budget Goal** |

3. 🌅 Time-Tagged Daily Activities with Badges & Emojis:
   - Format daily breakdowns with clear sub-headings and vivid time badges:
   ### 📍 Day 1: Welcome to San Juan, Puerto Rico (Colonial Sights & Sunset)
   - 🌅 **Morning (09:00 AM - 12:00 PM)**: Touchdown at Luis Muñoz Marín Airport, grab a local SIM card, and check into your cozy Old San Juan stay.
   - ☀️ **Afternoon (01:00 PM - 05:00 PM)**: Walk the historic blue cobblestone streets, explore *Castillo San Felipe del Morro* ($5), and snap photos by colorful Spanish colonial facades.
   - 🌙 **Evening (06:30 PM - 09:30 PM)**: Savor authentic *Mofongo con Camarones* at a local eatery (~$18), followed by a twilight ocean stroll along *Paseo de la Princesa*.

4. 💡 Blockquote Callouts & Pro Tips:
   - Use Markdown blockquotes (`>`) to emphasize insider secrets, packing hacks, money-saving advice, or safety warnings:
   > 💡 **KelanaAI Insider Tip**: Purchase inter-island ferry or flight passes at least 2 weeks in advance to unlock $40-$60 discount fares.
   > 🥥 **Must-Try Culinary Highlight**: Taste fresh tropical *Alcapurrias* and cold coconut water straight from coastal fruit stands!

5. 🧳 Bullet Checklists & Key Takeaways:
   - Use structured bullet points with checkmarks (`- ✅ Packing Essential: ...`, `- 🚇 Transit Secret: ...`).

Always maintain context from earlier turns in the conversation thread (e.g. if the user asks "What about Day 2?" or "Can we adjust for $1,500?", adapt seamlessly with the same rich formatting).
Make your tone warm, encouraging, highly structured, and inspiring!"""


# Maximum context window history length (sliding window)
MAX_CONTEXT_MESSAGES = 20


def generate_title_from_prompt(prompt: str) -> str:
    """Generate a clean, readable 3-6 word title from the initial user prompt."""
    cleaned = re.sub(r"[^\w\s-]", "", prompt).strip()
    words = cleaned.split()
    if not words:
        return "Travel Discussion"
    
    # Title-case first 4-5 words
    title_words = words[:5]
    title = " ".join(title_words).title()
    if len(title) > 40:
        title = title[:37] + "..."
    return title


def create_conversation(db: Session, user: Users, title: Optional[str] = None) -> Conversation:
    """Create a new conversation thread for the user."""
    conv_title = title.strip() if title and title.strip() else "New Conversation"
    conversation = Conversation(
        user_id=user.id,
        title=conv_title,
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def list_conversations(db: Session, user: Users) -> List[Dict[str, Any]]:
    """Retrieve all conversations belonging to the user, sorted newest first."""
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user.id)
        .order_by(Conversation.id.desc())
        .all()
    )
    return [c.to_dict() for c in conversations]


def get_conversation_with_messages(db: Session, conversation_id: int, user: Users) -> Dict[str, Any]:
    """Retrieve conversation details and full chronological message history."""
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with id {conversation_id} not found."
        )
    if conv.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to access this conversation."
        )

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc(), Message.id.asc())
        .all()
    )

    conv_data = conv.to_dict()
    conv_data["messages"] = [m.to_dict() for m in messages]
    return conv_data


def rename_conversation(db: Session, conversation_id: int, user: Users, new_title: str) -> Dict[str, Any]:
    """Rename a conversation thread (Part of Bonus Challenge)."""
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with id {conversation_id} not found."
        )
    if conv.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to modify this conversation."
        )

    if not new_title or not new_title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title cannot be empty."
        )

    conv.title = new_title.strip()
    db.commit()
    db.refresh(conv)
    return conv.to_dict()


def delete_conversation(db: Session, conversation_id: int, user: Users) -> Dict[str, Any]:
    """Delete a conversation thread and its associated messages."""
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with id {conversation_id} not found."
        )
    if conv.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to delete this conversation."
        )

    db.delete(conv)
    db.commit()
    return {"message": f"Conversation {conversation_id} deleted successfully."}


def build_bedrock_messages_from_history(history_messages: List[Message]) -> List[Dict[str, Any]]:
    """
    Context-Aware Prompt Builder (Part 5 & Part 8):
    Converts database messages into Bedrock Converse API format with sliding window trimming
    and alternating role validation.
    """
    # Sliding window: keep only the most recent MAX_CONTEXT_MESSAGES
    trimmed_history = history_messages[-MAX_CONTEXT_MESSAGES:]

    formatted_messages: List[Dict[str, Any]] = []

    for msg in trimmed_history:
        role = "user" if msg.role == "user" else "assistant"
        content_text = msg.content.strip()
        if not content_text:
            continue

        # If previous message has same role, merge text to strictly satisfy Bedrock alternating requirement
        if formatted_messages and formatted_messages[-1]["role"] == role:
            formatted_messages[-1]["content"][0]["text"] += f"\n\n{content_text}"
        else:
            formatted_messages.append({
                "role": role,
                "content": [{"text": content_text}]
            })

    # Bedrock requires the first message in the list to have role 'user'
    while formatted_messages and formatted_messages[0]["role"] != "user":
        formatted_messages.pop(0)

    return formatted_messages


def generate_fallback_chat_response(messages: List[Message]) -> str:
    """Generate intelligent contextual fallback response if Bedrock service is temporarily unavailable."""
    last_user_msg = next((m.content for m in reversed(messages) if m.role == "user"), "travel questions")
    return (
        f"Thank you for sharing your thoughts! I've noted your request regarding **'{last_user_msg[:60]}'**.\n\n"
        "Here are key travel planning recommendations:\n"
        "- **Itinerary Pacing**: Group neighboring sights together in morning and afternoon blocks.\n"
        "- **Local Transit**: Leverage high-speed rail, IC cards, and integrated day passes for seamless travel.\n"
        "- **Dining & Culture**: Reserve popular authentic restaurants in advance and explore local food alleys in the evening.\n\n"
        "Feel free to ask follow-up questions, request specific daily breakdowns, or ask about budget estimates!"
    )


def orchestrate_send_message(
    db: Session,
    conversation_id: int,
    user: Users,
    user_content: str,
) -> Dict[str, Any]:
    """
    7-Step Send Message API Orchestration Pipeline (Part 4):
    1. Receive User Message
    2. Save User Message to DB
    3. Load Previous Messages from DB
    4. Build Prompt (Context-Aware History Builder)
    5. Amazon Bedrock invocation
    6. Save AI Response to DB
    7. Return Response
    """
    # 01. Validate conversation ownership
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with id {conversation_id} not found."
        )
    if conv.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to send messages in this conversation."
        )

    # 02. Save User Message to DB
    clean_user_content = user_content.strip()
    if not clean_user_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty."
        )

    user_msg = Message(
        conversation_id=conversation_id,
        role="user",
        content=clean_user_content,
        title=clean_user_content[:50],
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # Auto-update conversation title if it is still default "New Conversation"
    if conv.title in ["New Conversation", "New Chat", ""]:
        conv.title = generate_title_from_prompt(clean_user_content)
        db.commit()
        db.refresh(conv)

    # 03. Load All Previous Messages from DB in chronological order
    all_messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc(), Message.id.asc())
        .all()
    )

    # 04. Build Prompt with Context & Sliding Window
    bedrock_messages = build_bedrock_messages_from_history(all_messages)

    # 05. Amazon Bedrock Invocation
    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")
    ai_response_text = ""

    try:
        if bedrock_client and bedrock_messages:
            response = bedrock_client.converse(
                modelId=model_id,
                system=[{"text": SYSTEM_PROMPT}],
                messages=bedrock_messages,
                inferenceConfig={
                    "maxTokens": 4096,
                    "temperature": 0.7,
                    "topP": 0.9,
                },
            )
            output_message = response.get("output", {}).get("message", {})
            content_list = output_message.get("content", [])
            if content_list and "text" in content_list[0]:
                ai_response_text = content_list[0]["text"].strip()
    except Exception as e:
        print(f"[Bedrock Converse] Error invoking model ({e}), using contextual fallback.")

    if not ai_response_text:
        ai_response_text = generate_fallback_chat_response(all_messages)

    # 06. Save AI Response to DB
    ai_msg = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=ai_response_text,
        title="KelanaAI Response",
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    # 07. Return Response
    return {
        "conversation_id": conversation_id,
        "conversation_title": conv.title,
        "user_message": user_msg.to_dict(),
        "assistant_message": ai_msg.to_dict(),
    }
