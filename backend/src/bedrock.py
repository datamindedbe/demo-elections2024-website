# functions for interacting with bedrock
# this is a first pass, afterwards can do it with better structure

import boto3
import json
from dataclasses import dataclass
from config import AWS_PROFILE_NAME, BEDROCK_REGION, BEDROCK_BUCKET
from src.aws import read_txt_from_s3
from src.util import title_to_url

if AWS_PROFILE_NAME:
    boto3.setup_default_session(profile_name=AWS_PROFILE_NAME)

bedrock = boto3.client('bedrock-agent-runtime', region_name=BEDROCK_REGION)


@dataclass
class BedrockRetrievedItem:
    text: str
    score: float
    s3_uri: str

    @property
    def decision_url(self) -> str:
        # the s3 uri is for clean data -> we need to augment this is with other data to get the correct url
        year, month, day = self.s3_uri.split('/')[-1].split('-')[:3]
        date = f"{year}-{month}-{day}"
        document_id = self.s3_uri.split('-')[-1].rstrip('.txt')
        ingestion_file_key = f"ingestion/output/{year}/{month}/{document_id}/document.json"
        ingestion_contents = read_txt_from_s3(BEDROCK_BUCKET, ingestion_file_key)

        if ingestion_contents:
                ingestion_contents = json.loads(ingestion_contents)
                source_title = ingestion_contents['attributes']['title']
                source_date = ingestion_contents['attributes']['meetingDate']
                source_url = title_to_url(source_title, source_date)
                return source_url
        else:
             return ''

# add nex token functionality

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
