from typing import Optional
from src.bedrock import retrieve_bedrock_items
from config import BEDROCK_KNOWLEDGE_BASE_ID
import json


def lambda_handler(event: dict, context: Optional[dict] = None):
    
    if len(event["query"]) < 10:
        return {"statusCode": 400, "body": json.dumps("Vraag niet lang genoeg.")}
    
    if len(event["query"]) > 1000:
        return {"statusCode": 400, "body": json.dumps("Vraag te lang.")}

    response = retrieve_bedrock_items(
        BEDROCK_KNOWLEDGE_BASE_ID,
        event["query"],
        10
    )
    items = []
    for bedrock_item in response:
        item = {
            "text": bedrock_item.text,
            "decision_url": bedrock_item.decision_url,
            "title": bedrock_item.title,
            "meeting_date": bedrock_item.meeting_date,
            "score": bedrock_item.score
        }
        items.append(item)

    return {"statusCode": 200, "body": json.dumps(items)}

if __name__ == "__main__":
    response = lambda_handler({
            "query": "what has the belgian government done regarding covid"
        }
    )
    print(response)
    