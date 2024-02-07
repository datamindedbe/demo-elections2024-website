
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

    if len(no_memory_query.query) < 20: # these are place holder numbers for now
        return {"message": "Query too short"}
    if len(no_memory_query.query) > 1000:
        return {"message": "Query too short"}
    
    # we extend the query to better match items in the vector database
    extended_query = extended_message(no_memory_query.query)
    decisions_collection = VectorCollection(name="decisions")
    matching_decisions = decisions_collection.similar_items(extended_query, n_results=20)

    # generate question response using matching_decisions
    query_response = decisions_query(extended_query, matching_decisions)
    return {"message": query_response}