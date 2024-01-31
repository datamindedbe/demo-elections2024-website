import chromadb
from chromadb.utils import embedding_functions
from typing import Optional, List
from dataclasses import dataclass

from src import DB_PATH, OPENAI_API_KEY
from src.util import remove_newline_char

Chroma_client = chromadb.PersistentClient(path=DB_PATH)

@dataclass
class VectorDBItem():
    id: str
    text: str
    metadata: Optional[dict] = None
    distance: Optional[float] = None


class VectorCollection():
    # wrapper of chromadb

    def __init__(self, name: str, metadata: Optional[dict] = None,):
        self.name = name
        self.metadata = metadata
        self.chromadb_collection = Chroma_client.create_collection(name,
                                                           embedding_function=self._embedding_function(),
                                                           metadata=metadata,
                                                           get_or_create=True)

    @staticmethod
    def _embedding_function():
        return embedding_functions.OpenAIEmbeddingFunction(
                api_key=OPENAI_API_KEY,
                model_name="text-embedding-ada-002"
            )

    def add_item(self, document, metadata,id)-> None:
        self.chromadb_collection.add(
            documents=[document],
            metadatas=[metadata],
            ids=[id]
        )

    def similar_items(self, input_text: str, n_results: int = 10) -> List[VectorDBItem]:
        response = self.chromadb_collection.query(
                query_texts=[input_text],
                n_results=n_results
        )
        items = []
        for id, document, metadata, distance  in zip(response['ids'][0], response['documents'][0], response['metadatas'][0], response['distances'][0]):
            items.append(VectorDBItem(id=id, text=remove_newline_char(document), metadata=metadata, distance=distance))
        return items


