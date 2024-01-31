# defines common environment variables
# for the backend
import os

## local paths relative to root (from where scripts should be run)
AGREEMENTS_PATH = "data/agreement_document/sections/raw/"


# aws resource config
DECISIONS_S3_BUCKET = "genai-elections2024"
DECISIONS_S3_PREFIX_CLEAN = "clean/"
DECISIONS_S3_BUCKET_INGESTION = "ingestion/"