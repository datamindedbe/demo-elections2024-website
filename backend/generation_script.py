# a test script to implement the RAG procedure
# should be replaced by a lambda implementation


# do the retrieval via bedrock
from src.bedrock import retrieve_bedrock_items, re_reference, BedrockRetrievedItem
from src.llm import decisions_query
from config import BEDROCK_KNOWLEDGE_BASE_ID
import json
from typing import List

def retrieval(query: str):
    if len(query) < 10:
        return {"statusCode": 400, "body": json.dumps("Vraag niet lang genoeg.")}
    
    if len(query) > 1000:
        return {"statusCode": 400, "body": json.dumps("Vraag te lang.")}
    
    response = retrieve_bedrock_items(BEDROCK_KNOWLEDGE_BASE_ID, query, 10)
    return response

# do the generation
def generate(query: str, decisions: List[BedrockRetrievedItem]):
    response = decisions_query(query, decisions)
    return response



# run
if __name__ == "__main__":
   query = "wat heeft de regering gedaan om de economie te stimuleren?"
   context = retrieval(query)
   response = generate(query, context)
   response, used_decisions = re_reference(response, context)
   print(response)
   print('---')
   print([item.s3_uri for item in used_decisions])
