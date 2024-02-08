
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.llm import extended_message, decisions_query
from src.vector_store import VectorCollection

app = FastAPI()
origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NoMemoryQuery(BaseModel):
    query: str

@app.post("/no-memory-decision-query")
async def query_decisions(no_memory_query: NoMemoryQuery):

    print(f"received query :{no_memory_query.query}")
    if len(no_memory_query.query) < 20: # these are place holder numbers for now
        print(f"message too short")
        return {"message": "Query too short"}
    if len(no_memory_query.query) > 1000:
        print(f"message too long")
        return {"message": "Query too short"}
    
    # we extend the query to better match items in the vector database
    print(f"extending query :{no_memory_query.query}")
    extended_query = extended_message(no_memory_query.query)
    print(f"extended query :{extended_query}")
    decisions_collection = VectorCollection(name="decisions")
    matching_decisions = decisions_collection.similar_items(extended_query, n_results=20)
    print(f"found matching decisions:{len(matching_decisions)}")

    # generate question response using matching_decisions
    query_response = decisions_query(extended_query, matching_decisions)
    print(f"response generated :{query_response}")
    return {"message": query_response}