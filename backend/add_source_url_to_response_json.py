# this script assumes llm responses exist in json format
# confroming to the standard as generated in backend/llm_responses_to_json.py
import os
import json
import boto3

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
            url = decision['attributes']['uri']
            data['references'][index]['source_url'] = url
            # resave the data
            with open(input_file_name, 'w') as f:
                json.dump(data, f, indent=4)
            


if __name__ == '__main__':

    SOURCE_JSONS_PATH = 'data/llm_responses/agreement_adherence/60k_token_context/'
    S3_BUCKET = 'genai-elections2024'
    DECISIONS_PATH = 'data/decisions/'
    profile_name = os.environ.get('AWS_PROFILE_NAME')
    print(f'Using AWS profile: {profile_name}')

    boto3.setup_default_session(profile_name=profile_name)
    s3 = boto3.resource('s3')
    s3_bucket = s3.Bucket(S3_BUCKET)

    for section in  os.listdir(SOURCE_JSONS_PATH):
        response_json_path = SOURCE_JSONS_PATH + section + '/clean_responses.json'
        add_url_to_response_json(response_json_path, s3_bucket, DECISIONS_PATH)
    