from src.bedrock import retrieve_bedrock_items, re_reference, BedrockRetrievedItem
from src.llm import decisions_query
from config import BEDROCK_KNOWLEDGE_BASE_ID, OPENAI_MODEL_NAME_CHATBOT
import json
from typing import Optional
import time

def lambda_handler(event: dict, context: Optional[dict] = None):

    query = event["query"]
    
    if len(query) < 10:
        return {"statusCode": 400, "body": json.dumps("Vraag niet lang genoeg.")}
    if len(query) > 500:
        return {"statusCode": 400, "body": json.dumps("Vraag te lang.")}
    
    start = time.time()
    retrieved_items = retrieve_bedrock_items(BEDROCK_KNOWLEDGE_BASE_ID, query, 5)
    stop = time.time()
    print(f"Bedrock retrieval took {stop - start} seconds.")

    start = time.time()
    llm_response = decisions_query(query, retrieved_items, llm_model=OPENAI_MODEL_NAME_CHATBOT)
    stop = time.time()
    print(f"LLM generation took {stop - start} seconds.")

    start = time.time()
    re_referenced_llm_response, used_decisions = re_reference(llm_response, retrieved_items)
    stop = time.time()
    print(f"Re-referencing took {stop - start} seconds.")

    start = time.time()
    used_decisions_dicts = []
    for decision in used_decisions:
        used_decisions_dicts.append({
            "text": decision.text,
            "decision_url": decision.decision_url,
            "title": decision.title,
            "meeting_date": decision.meeting_date,
            "score": decision.score
        })
    stop = time.time()
    print(f"Converting used decisions to dict took {stop - start} seconds.")
    
    return {"statusCode": 200, "body": json.dumps({"response":re_referenced_llm_response,"decisions":used_decisions_dicts})}

if __name__ == "__main__":
    response = lambda_handler({
            "query": "what is the government doing to improve the housing market?"
        }
    )
    print(response)