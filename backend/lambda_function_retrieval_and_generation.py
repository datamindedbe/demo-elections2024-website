from src.bedrock import retrieve_bedrock_items, re_reference, BedrockRetrievedItem
from src.llm import decisions_query
from config import BEDROCK_KNOWLEDGE_BASE_ID, OPENAI_MODEL_NAME_CHATBOT
import json
from typing import Optional
import time
import traceback
import uuid


def lambda_handler(event: dict, context: Optional[dict] = None):
    # generate a uuid for the request to keep track of it in logs
    invocation_id = str(uuid.uuid4())
    try:
        query = event["query"]
        print(f"RECIEVED_QUERY: {query} - INVOCATION_ID:{invocation_id}")
        
        if len(query) < 10:
            print(f"SHORT_QUERY - INVOCATION_ID:{invocation_id}")
            return {"statusCode": 400, "body": json.dumps("Vraag niet lang genoeg.")}
        if len(query) > 500:
            print(f"LONG_QUERY - INVOCATION_ID:{invocation_id}")
            return {"statusCode": 400, "body": json.dumps("Vraag te lang.")}
        
        start = time.time()
        retrieved_items = retrieve_bedrock_items(BEDROCK_KNOWLEDGE_BASE_ID, query, 5)
        stop = time.time()
        retrieval_time = stop - start
        print(f"Bedrock retrieval took {retrieval_time} seconds. - INVOCATION_ID:{invocation_id}")

        start = time.time()
        llm_response = decisions_query(query, retrieved_items, llm_model=OPENAI_MODEL_NAME_CHATBOT)
        stop = time.time()
        llm_generation_time = stop - start
        print(f"LLM generation took {llm_generation_time} seconds. - INVOCATION_ID:{invocation_id}")

        start = time.time()
        re_referenced_llm_response, used_decisions = re_reference(llm_response, retrieved_items)
        stop = time.time()
        re_referencing_time = stop - start
        print(f"Re-referencing took {re_referencing_time} seconds. - INVOCATION_ID:{invocation_id}")


        # condition for when there are no decisions used in the response
        if len(used_decisions) == 0:
            print(f"NO_DECISIONS_USED - INVOCATION_ID:{invocation_id}")
            generic_response = "Sorry, maar ik kon geen relevante data vinden om uw vraag te kunnen beantwoorden. Mijn excuses."

            return {"statusCode": 400, "body": json.dumps(generic_response)}

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
        fetching_decision_data_time = stop - start
        print(f"fetching decision data took {fetching_decision_data_time} seconds. - INVOCATION_ID:{invocation_id}")


        total_time = retrieval_time + llm_generation_time + re_referencing_time + fetching_decision_data_time
        print(f"TOTAL_TIME: {total_time} seconds. - INVOCATION_ID:{invocation_id}")
        if total_time > 30:
            print(f"TIME_EXCEEDED - INVOCATION_ID:{invocation_id}")

        response = json.dumps({"response":re_referenced_llm_response,"decisions":used_decisions_dicts})
        print(f"RESPONSE: {response} - INVOCATION_ID:{invocation_id}")
        
        return {"statusCode": 200, "body": response}
    
    except Exception:
        print(traceback.format_exc() + f" - INVOCATION_ID:{invocation_id}") 
        return {"statusCode": 500, "body": "er is iets fout gegaan. Probeer het later opnieuw."}

if __name__ == "__main__":
    response = lambda_handler({
            "query": "what is the government doing to improve the housing market?"
        }
    )