# this is a test
# there are some decisions that are too short to be useful
# or they are there purely because they hold document links, but we not
# store or parse the documents, thus these links are not useful and confuse the
# embedding search for small decisons

from datetime import datetime
from dateutil.relativedelta import relativedelta
import logging
import sys
import boto3
from config_scrapers import (
    SCRAPER_DECISIONS_AWS_PROFILE_NAME,
    SCRAPER_DECISIONS_OUTPUT_S3_BUCKET,
    SCRAPER_DECISIONS_START_DATE,
    SCRAPER_DECISIONS_OUTPUT_S3_PREFIX_CLEAN,
    SCRAPER_DECISIONS_OUTPUT_S3_PREFIX_CLEAN_REDUCED
)

boto3.setup_default_session(profile_name=SCRAPER_DECISIONS_AWS_PROFILE_NAME)
S3 = boto3.client('s3')

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def list_s3_files(bucket_name, prefix):
    # Use the paginator to handle large result sets
    paginator = S3.get_paginator('list_objects_v2')
    result = paginator.paginate(Bucket=bucket_name, Prefix=prefix)

    # Iterate through the pages and list the files
    file_list = []

    for page in result:
        if 'Contents' in page:
            for obj in page['Contents']:
                file_list.append(obj['Key'])

    return file_list

def get_months():
    months=[]
    start = SCRAPER_DECISIONS_START_DATE
    while start < datetime.now().date():
        month= {}
        end = start + relativedelta(months=1) - relativedelta(days=1)
        month['start'] = start.strftime("%Y-%m-%d")
        month['end'] =  end.strftime("%Y-%m-%d")
        months.append(month)
        start = start + relativedelta(months=1)
    return months

def read_txt_from_s3(bucket_name, key):
    try:
        # Read the JSON file from S3
        response = S3.get_object(Bucket=bucket_name, Key=key)
        content = response['Body'].read().decode('utf-8')
        return content

    except Exception as e:
        print(f"Error reading .txt from S3: {e}")
        return None
    
def put_object_to_s3(string, path, bucket):
    S3.put_object(
        Body=string,
        Bucket=bucket,
        Key=path
    )


def run():
    months = [m['start'] for m in get_months()]
    for m in months:
        print(f'processing month {m}')
        m_parts = m.split('-')

        files = list_s3_files(SCRAPER_DECISIONS_OUTPUT_S3_BUCKET, f'{SCRAPER_DECISIONS_OUTPUT_S3_PREFIX_CLEAN}{m_parts[0]}/{m_parts[1]}')
        
        for file in files:
            if file.endswith('.txt'):
                contents = read_txt_from_s3(SCRAPER_DECISIONS_OUTPUT_S3_BUCKET, file)
                titles_part, body = contents.split('\n\n', 1)
                title = titles_part.split('\n', 1)[0] # there is the possibility there is a subtitle as well
                
                if len(title) > len(body):
                    # this is a case of a short decision
                    # typically meaning that it is just a holder for documents.
                    # if we decide to store the documents then it may make more sense to keep those decisions
                    continue

                put_object_to_s3(
                    contents,
                    f'{SCRAPER_DECISIONS_OUTPUT_S3_PREFIX_CLEAN_REDUCED}{m_parts[0]}/{m_parts[1]}/{file.split("/")[-1]}',
                    SCRAPER_DECISIONS_OUTPUT_S3_BUCKET
                )

if __name__ == '__main__':
    run()