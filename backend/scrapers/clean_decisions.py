from datetime import date, datetime
from dateutil.relativedelta import relativedelta
import logging
import json
import sys
import html2text
import re
import boto3
from config_scrapers import (
    SCRAPER_DECISIONS_AWS_PROFILE_NAME,
    SCRAPER_DECISIONS_OUTPUT_S3_BUCKET,
    SCRAPER_DECISIONS_START_DATE,
    SCRAPER_DECISIONS_OUTPUT_S3_PREFIX,
    SCRAPER_DECISIONS_OUTPUT_S3_PREFIX_CLEAN
)

boto3.setup_default_session(profile_name=SCRAPER_DECISIONS_AWS_PROFILE_NAME)
S3 = boto3.client('s3')

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

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

def read_json_from_s3(bucket_name, key):
    try:
        # Read the JSON file from S3
        response = S3.get_object(Bucket=bucket_name, Key=key)
        content = response['Body'].read().decode('utf-8')

        # Parse the JSON content
        data = json.loads(content)

        return data

    except Exception as e:
        print(f"Error reading JSON from S3: {e}")
        return None

def remove_html_tags(input_html):
    # Convert HTML to plain text
    text = html2text.html2text(input_html)
    
    return text

def remove_markdown(input_text):
    # Remove inline links
    text_without_links = re.sub(r'\[([^\]]*)\]\([^\)]*\)', r'\1', input_text)
    
    # Remove images
    text_without_images = re.sub(r'\!\[([^\]]*)\]\([^\)]*\)', '', text_without_links)
    
    # Remove headings
    text_without_headings = re.sub(r'#{1,6}\s', '', text_without_images)
    
    # Remove bold and italic formatting
    text_without_formatting = re.sub(r'(\*\*|__)(.*?)\1', r'\2', text_without_headings)
    text_without_formatting = re.sub(r'(\*|_)(.*?)\1', r'\2', text_without_formatting)

    return text_without_formatting

def extract_date_from_datetime(datetime_string):
    # Convert the string to a datetime object
    dt_object = None
    try:
        dt_object = datetime.strptime(datetime_string, "%Y-%m-%dT%H:%M:%SZ")
    except:
        try:
            dt_object = datetime.strptime(datetime_string, "%Y-%m-%dT%H:%M:%S.%fZ")
        except:
            pass

    if dt_object is None:
        return None
    
    # Extract the date-only part
    date_only = dt_object.date()

    return date_only
    

def get_attribute_string(contents, attribute_name):
    attribute = ''
    try:
        if attribute_name in contents['attributes'] and contents['attributes'][attribute_name] is not None:
            attribute_content = contents['attributes'][attribute_name]
            if isinstance(attribute_content, list):
                attribute_content = attribute_content[0]
            attribute_content = remove_markdown(remove_html_tags(attribute_content)).strip()
    except:
        pass
    return attribute

def put_object_to_s3(jsonstring, path):
    S3.put_object(
        Body=jsonstring,
        Bucket=SCRAPER_DECISIONS_OUTPUT_S3_BUCKET,
        Key=path
    )


def run():
    months = [m['start'] for m in get_months()]
    for m in months:
        m_parts = m.split('-')

        files = list_s3_files(SCRAPER_DECISIONS_OUTPUT_S3_BUCKET, f'{SCRAPER_DECISIONS_OUTPUT_S3_PREFIX}{m_parts[0]}/{m_parts[1]}')
        
        for file in files:
            if file.endswith('document.json'):
                contents = read_json_from_s3(SCRAPER_DECISIONS_OUTPUT_S3_BUCKET, file)
                if contents:
                    logging.info(f'Processing {file}')

                    title = get_attribute_string(contents, 'title')
                    alternative_title = get_attribute_string(contents, 'alternativeTitle')
                    body = get_attribute_string(contents, 'htmlContent')
                    agenda_type = get_attribute_string(contents, 'agendaitemType').lower()
                    uuid = get_attribute_string(contents, 'uuid')
                    date = extract_date_from_datetime(contents['attributes']['meetingDate'])
                    if date:
                        date = str(date)
                    else:
                        date = m

                    # Put cleaned file on S3
                    export_string = f'{title}\n{alternative_title}\n\n{body}'

                    put_object_to_s3(
                        export_string,
                        f'{SCRAPER_DECISIONS_OUTPUT_S3_PREFIX_CLEAN}{m_parts[0]}/{m_parts[1]}/{date}-{agenda_type}-{uuid}.txt'
                    )

if __name__ == '__main__':
    run()