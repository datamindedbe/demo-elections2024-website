# functions for interacting with bedrock
# this is a first pass, afterwards can do it with better structure

import boto3
import json
from typing import Optional
from dataclasses import dataclass
from functools import lru_cache
from config import AWS_PROFILE_NAME, BEDROCK_REGION, BEDROCK_BUCKET
from src.aws import read_txt_from_s3
from src.util import title_to_url

if AWS_PROFILE_NAME:
    boto3.setup_default_session(profile_name=AWS_PROFILE_NAME)

bedrock = boto3.client('bedrock-agent-runtime', region_name=BEDROCK_REGION)


@dataclass(frozen=True)
class BedrockRetrievedItem:
    text: str
    score: float
    s3_uri: str

    @property
    @lru_cache # cache the s3 retrieval as it is required to populate the other properties
    def raw_ingestion_content(self) -> Optional[dict]:
        year, month, day = self.s3_uri.split('/')[-1].split('-')[:3]
        document_id = self.s3_uri.split('-')[-1].rstrip('.txt')
        ingestion_file_key = f"ingestion/output/{year}/{month}/{document_id}/document.json"
        ingestion_content = read_txt_from_s3(BEDROCK_BUCKET, ingestion_file_key)

        if ingestion_content:
            return json.loads(ingestion_content)
        else:
            return None

    @property
    def meeting_date(self) -> Optional[str]:
        if self.raw_ingestion_content:
            return self.raw_ingestion_content['attributes']['meetingDate']
        else:
            return None
        
    @property
    def title(self) -> Optional[str]:
        if self.raw_ingestion_content:
            return self.raw_ingestion_content['attributes']['title']
        else:
            return None

    @property
    def decision_url(self) -> Optional[str]:
        if self.title and self.meeting_date:
                source_url = title_to_url(self.title, self.meeting_date)
                return source_url
        else:
             return None

def retrieve_bedrock_items(knowledge_base_id: str, query: str, n_results: int = 10) -> list[BedrockRetrievedItem]:

    results = []

    while True:
        response = bedrock.retrieve(
            knowledgeBaseId=knowledge_base_id,
            retrievalQuery={
                'text': query
            },
            retrievalConfiguration={
                'vectorSearchConfiguration': {
                    'numberOfResults': n_results
                }
            }
        )
        next_token = response.get('nextToken')
        results += [BedrockRetrievedItem(text=item['content']['text'],
                                        score=item['score'],
                                        s3_uri=item['location']['s3Location']['uri'])
                                        for item in response['retrievalResults']]
        if not next_token:
            break 

    return results
