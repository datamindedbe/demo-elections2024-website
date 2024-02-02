# defines common environment variables
# for the backend
import os

# this defines the llm responses we want to work/on display. when implementing a 
# new set of responses this path needs to change
LLM_RESPONSE_PATH_OF_INTEREST = 'data/llm_responses/agreement_adherence/20k_token_context_full_generation/'

## local paths relative to root (from where scripts should be run)
AGREEMENTS_PATH = "data/agreement_document/sections/raw/"
DECISIONS_LOCAL = "data/decisions/"
VECTOR_DB_PATH = "data/vector_db"
FRONTEND_DOCS_PATH = "frontend/docs/"


# aws resource config
AWS_PROFILE_NAME= os.environ.get('AWS_PROFILE_NAME')
DECISIONS_S3_BUCKET = "genai-elections2024"
DECISIONS_S3_PREFIX_CLEAN = "clean/"
DECISIONS_S3_BUCKET_INGESTION = "ingestion/"

# openai/llm config
OPENAI_API_KEY =  os.environ.get('OPENAI_API_KEY')
OPENAI_MODEL_NAME = "gpt-4-1106-preview"
