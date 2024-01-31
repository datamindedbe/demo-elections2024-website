# defines common environment variables
# for the backend
import os

## local paths relative to root (from where scripts should be run)
AGREEMENTS_PATH = "data/agreement_document/sections/raw/"
VECTOR_DB_PATH = "data/vector_db"

# aws resource config
AWS_PROFILE_NAME= os.environ.get('AWS_PROFILE_NAME')
DECISIONS_S3_BUCKET = "genai-elections2024"
DECISIONS_S3_PREFIX_CLEAN = "clean/"
DECISIONS_S3_BUCKET_INGESTION = "ingestion/"

# openai/llm config
OPENAI_API_KEY =  os.environ.get('OPENAI_API_KEY')
OPENAI_MODEL_NAME = "gpt-4-1106-preview"