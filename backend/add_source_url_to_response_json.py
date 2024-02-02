# this script assumes llm responses exist in json format
# confroming to the standard as generated in backend/llm_responses_to_json.py
import os
import json
import boto3
import urllib


def title_to_url(title, date):
    # this is a very custom function to interact with the flemish government's website
    url_friendly_title = urllib.parse.quote(title)
    url_friendly_date = urllib.parse.quote(date)
    full_url = f"https://beslissingenvlaamseregering.vlaanderen.be/?search={url_friendly_title}&dateOption=select&startDate={url_friendly_date}&endDate={url_friendly_date}"
    return full_url

def add_url_to_response_json(input_file_name, s3_bucket, decisions_path):
    with open(input_file_name, 'r') as f:
        data = json.load(f)

    references = data['references']
    for index, item in references.items():
        ingested_file_key = item.get('s3_filename_ingested', None)
        if ingested_file_key is None:
            print('no ingested file key found')
            continue

        # first check for file locally
        if os.path.exists(decisions_path + ingested_file_key):
            print('file exists locally')
        else:
            print('file does not exist locally, will download')
            # download file from s3
            print(ingested_file_key)
            file_name = ingested_file_key.split('/')[-1]
            path_part = ingested_file_key.rstrip(file_name)
            if not os.path.exists(decisions_path + path_part):
                os.makedirs(decisions_path + path_part)
            try:
                s3_bucket.download_file(ingested_file_key, decisions_path + ingested_file_key)
            except Exception as e:
                print(f'Error downloading file: {e}')
                continue

        # add url to json
        with open(decisions_path + ingested_file_key, 'r') as f:
            decision = json.load(f)
            title = decision['attributes']['title']
            date = decision['attributes']['meetingDate']
            data['references'][index]['source_url'] = title_to_url(title, date)
            data['references'][index]['source_title'] = title
            # resave the data
            with open(input_file_name, 'w') as f:
                json.dump(data, f, indent=4)
            


if __name__ == '__main__':
    from config import LLM_RESPONSE_PATH_OF_INTEREST, DECISIONS_S3_BUCKET, DECISIONS_LOCAL, AWS_PROFILE_NAME

    boto3.setup_default_session(profile_name=AWS_PROFILE_NAME)
    s3 = boto3.resource('s3')
    s3_bucket = s3.Bucket(DECISIONS_S3_BUCKET)

    for section in  os.listdir(LLM_RESPONSE_PATH_OF_INTEREST):
        response_json_path = LLM_RESPONSE_PATH_OF_INTEREST + section + '/clean_responses.json'
        add_url_to_response_json(response_json_path, s3_bucket, DECISIONS_LOCAL)
    