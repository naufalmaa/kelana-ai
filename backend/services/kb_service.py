"""
KelanaAI - AWS Bedrock Knowledge Base Service (RAG)
Retrieves relevant travel information from AWS Bedrock Knowledge Base
and generates grounded answers using AWS Bedrock Foundation Models.
"""

import os
import boto3
from typing import Optional, Dict, Any, List
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# AWS Credentials & Config from .env
AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID", "EW7EM5BPON")
KNOWLEDGE_BASE_MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN")
MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

# If Bearer token is set in .env, export for boto3 runtime support as well
BEARER_TOKEN = os.getenv("AWS_BEARER_TOKEN_BEDROCK") or os.getenv("AWS_BEARER_TOKEN")
if BEARER_TOKEN:
    os.environ["AWS_BEARER_TOKEN"] = BEARER_TOKEN


def get_agent_runtime_client():
    """
    Initializes Bedrock Agent Runtime client with credentials & region.
    """
    kwargs: Dict[str, Any] = {"region_name": AWS_REGION}
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        kwargs["aws_access_key_id"] = AWS_ACCESS_KEY_ID
        kwargs["aws_secret_access_key"] = AWS_SECRET_ACCESS_KEY

    return boto3.client("bedrock-agent-runtime", **kwargs)


def get_bedrock_runtime_client():
    """
    Initializes Bedrock Runtime client for text generation (Converse API).
    """
    kwargs: Dict[str, Any] = {"region_name": AWS_REGION}
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        kwargs["aws_access_key_id"] = AWS_ACCESS_KEY_ID
        kwargs["aws_secret_access_key"] = AWS_SECRET_ACCESS_KEY

    return boto3.client("bedrock-runtime", **kwargs)


# Initialize clients
agent_client = get_agent_runtime_client()
runtime_client = get_bedrock_runtime_client()


def retrieve_from_knowledge_base(
    question: str,
    kb_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Retrieves relevant passages/chunks from Bedrock Knowledge Base.
    """
    active_kb_id = kb_id or KNOWLEDGE_BASE_ID
    if not active_kb_id:
        return []

    try:
        response = agent_client.retrieve(
            knowledgeBaseId=active_kb_id,
            retrievalQuery={"text": question}
        )
        return response.get("retrievalResults", [])
    except ClientError as e:
        print(f"[KB Service] Bedrock retrieve error: {e}")
        return []
    except Exception as e:
        print(f"[KB Service] Unexpected retrieval error: {e}")
        return []


def ask_knowledge_base(
    question: str,
    kb_id: Optional[str] = None,
    model_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Answers user question using RAG:
    1. Retrieves relevant documents from Knowledge Base.
    2. Extracts source documents and metadata.
    3. Uses Bedrock model (e.g. Amazon Nova Lite / Claude) to synthesize an accurate, grounded answer.
    4. Returns a dictionary containing 'answer' and 'source_documents'.
    """
    selected_kb_id = kb_id or KNOWLEDGE_BASE_ID
    selected_model_id = model_id or MODEL_ID

    # 1. Retrieve relevant context from Knowledge Base
    retrieval_results = retrieve_from_knowledge_base(
        question=question,
        kb_id=selected_kb_id,
    )

    context_chunks = []
    source_documents = []

    for item in retrieval_results:
        text = item.get("content", {}).get("text", "").strip()
        if text:
            context_chunks.append(text)

        metadata = item.get("metadata", {})
        location = item.get("location", {})
        s3_uri = location.get("s3Location", {}).get("uri", "") if isinstance(location, dict) else ""
        source_uri = s3_uri or metadata.get("_source_uri", "")
        document_title = metadata.get("_document_title") or (source_uri.split("/")[-1] if source_uri else "Knowledge Base Document")

        source_documents.append({
            "document_title": document_title,
            "source_uri": source_uri,
            "content": text,
            "score": item.get("score"),
            "metadata": metadata,
        })

    # 2. Build RAG prompt
    if context_chunks:
        context_text = "\n\n---\n\n".join(context_chunks)
        system_prompt = (
            "You are KelanaAI's expert travel concierge assistant. "
            "Answer the user's travel question accurately, informatively, and concisely "
            "based on the verified travel context provided below. "
            "If the context does not fully answer the question, supplement with helpful general travel knowledge."
        )
        user_message = (
            f"Context from Knowledge Base:\n{context_text}\n\n"
            f"User Question:\n{question}\n\n"
            "Please provide a well-structured, friendly, and practical answer."
        )
    else:
        # Fallback prompt without KB context
        system_prompt = (
            "You are KelanaAI's expert travel concierge assistant. "
            "Answer the user's travel question in a friendly, practical, and well-structured manner."
        )
        user_message = question

    # 3. Generate grounded response using Bedrock Converse API
    try:
        response = runtime_client.converse(
            modelId=selected_model_id,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": user_message}],
                }
            ],
            inferenceConfig={
                "temperature": 0.5,
                "maxTokens": 2048,
            },
        )

        output_content = (
            response.get("output", {})
            .get("message", {})
            .get("content", [])
        )
        answer_text = (
            output_content[0]["text"]
            if output_content and "text" in output_content[0]
            else "I'm sorry, I couldn't generate an answer at this moment."
        )

        return {
            "answer": answer_text,
            "source_documents": source_documents,
        }

    except ClientError as e:
        error_msg = e.response.get("Error", {}).get("Message", str(e))
        print(f"[KB Service] Bedrock converse error: {error_msg}")
        return {
            "answer": f"Error communicating with AI service: {error_msg}",
            "source_documents": source_documents,
        }
    except Exception as e:
        print(f"[KB Service] Generation error: {e}")
        return {
            "answer": f"An error occurred while answering your question: {str(e)}",
            "source_documents": source_documents,
        }