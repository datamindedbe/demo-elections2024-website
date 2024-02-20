from src.bedrock import retrieve_bedrock_items, re_reference, BedrockRetrievedItem
from src.llm import decisions_query
from config import BEDROCK_KNOWLEDGE_BASE_ID
import json
from typing import Optional

def lambda_handler(event: dict, context: Optional[dict] = None):

    query = event["query"]
    
    if len(query) < 10:
        return {"statusCode": 400, "body": json.dumps("Vraag niet lang genoeg.")}
    if len(query) > 500:
        return {"statusCode": 400, "body": json.dumps("Vraag te lang.")}
    
    retrieved_items = retrieve_bedrock_items(BEDROCK_KNOWLEDGE_BASE_ID, query, 10)
    llm_response = decisions_query(query, retrieved_items)
    re_referenced_llm_response, used_decisions = re_reference(llm_response, retrieved_items)

    used_decisions_dicts = []
    for decision in used_decisions:
        used_decisions_dicts.append({
            "text": decision.text,
            "decision_url": decision.decision_url,
            "title": decision.title,
            "meeting_date": decision.meeting_date,
            "score": decision.score
        })
    
    return {"statusCode": 200, "body": json.dumps({"response":re_referenced_llm_response,"decisions":used_decisions_dicts})}

if __name__ == "__main__":
    response = lambda_handler({
            "query": "animal abuse"
        }
    )
    print(response)