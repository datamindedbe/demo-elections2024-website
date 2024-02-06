import requests
import json
from datetime import datetime
from dateutil.relativedelta import relativedelta
from requests.adapters import HTTPAdapter, Retry
import logging
import boto3
from config_scrapers import (
    SCRAPER_DECISIONS_START_DATE,
    SCRAPER_DECISIONS_OUTPUT_S3_BUCKET,
    SCRAPER_DECISIONS_OUTPUT_S3_PREFIX,
    SCRAPER_DECISIONS_BASE_URL,
    SCRAPER_DECISIONS_INFO_TEMPLATE,
    SCRAPER_DECISIONS_ATTACHMENT_TEMPLATE,
    SCRAPER_DECISIONS_AWS_PROFILE_NAME
)
headers = {'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36'}
boto3.setup_default_session(profile_name=SCRAPER_DECISIONS_AWS_PROFILE_NAME)
S3 = boto3.client('s3')


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

def store_news_contents(month, contents, output):
    month = month.replace("-", "/")
    for item in contents['data']:
        base_path = output + month + item["id"] + "/" 
        json_path = base_path + "document.json"

        store_json(item, json_path)
        # store_news_attachments(item['id'], base_path)

def try_get_url(url):
    downloaded = False
    while not downloaded:
        try: 
            retries = Retry(total=10,
                            backoff_factor=1,
                            status_forcelist=[ 500, 502, 503, 504 ])
            s = requests.Session()
            s.mount('https://', HTTPAdapter(max_retries=retries))
            response = s.request("GET", url, timeout=10)
            downloaded = True
            return response
        except Exception as ex:
            logging.info(f"\tDownload failed: {ex}")
            logging.info(f"\tRetrying...")
    
        
def store_json(item, path):
    jsonstring = json.dumps(item, indent=4)
    put_object_to_s3(jsonstring, path)
    logging.info(path)

def store_news_attachments(id, path):
    url = SCRAPER_DECISIONS_ATTACHMENT_TEMPLATE.format(id=id)
    page = try_get_url(url)
    contents = json.loads(page.text)            
    if 'included' in contents:
        json_path = f"{path}attachments.json"
        store_json(contents, json_path)

        for item in contents['included']:
            if item['type'] == 'files':
                filename = path + item['attributes']['filename']

                if not s3_file_exists(filename):
                    link = SCRAPER_DECISIONS_BASE_URL + item['relationships']['download']['links']['related']
                    response = try_get_url(link)
                    put_object_to_s3(response.content, filename)               
                    downloaded = True    

def put_object_to_s3(jsonstring, path):
    S3.put_object(
        Body=jsonstring,
        Bucket=SCRAPER_DECISIONS_OUTPUT_S3_BUCKET,
        Key=path
    )

def s3_file_exists(key):
    try:
        S3.head_object(Bucket=SCRAPER_DECISIONS_OUTPUT_S3_BUCKET, Key=key)
        return True
    except:
        return False

def run():
    months = get_months()
    for month in months:
        page_count = 0    
        page_size = 100
        processed = 0
        total = 0
        start = True
        while processed < total or start:
            start = False
            url = SCRAPER_DECISIONS_INFO_TEMPLATE.format(start=month['start'], end=month['end'], page = page_count)
            page = try_get_url(url)
            contents = json.loads(page.text)        
            store_news_contents(month['start'][:8], contents, output=SCRAPER_DECISIONS_OUTPUT_S3_PREFIX)
            total = contents['count']
            processed += len(contents['data'])
            page_count += 1
        logging.info(f"Stored {processed} items for month {month['start']}")

if __name__ == "__main__":
    run()