from typing import Optional
from src.bedrock import retrieve_bedrock_items
from config import BEDROCK_KNOWLEDGE_BASE_ID


def lambda_handler(event: dict, context: Optional[dict] = None):
    response = retrieve_bedrock_items(
        BEDROCK_KNOWLEDGE_BASE_ID,
        event["queryStringParameters"]["query"],
        10
    )
    links = [item.decision_url for item in response]
    return {"statusCode": 200, "body": links}

if __name__ == "__main__":
    response = lambda_handler({
        "queryStringParameters": {
            "query": "what has the belgian government done regarding covid"
        }
    })
    print(response)
    