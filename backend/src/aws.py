import boto3
from src import AWS_PROFILE_NAME
boto3.setup_default_session(profile_name=AWS_PROFILE_NAME)
s3_client= boto3.client('s3')

def list_s3_files(bucket_name, prefix):
    # Use the paginator to handle large result sets
    paginator = s3_client.get_paginator('list_objects_v2')
    result = paginator.paginate(Bucket=bucket_name, Prefix=prefix)

    # Iterate through the pages and list the files
    file_list = []

    for page in result:
        if 'Contents' in page:
            for obj in page['Contents']:
                file_list.append(obj['Key'])

    return file_list

def read_txt_from_s3(bucket_name, key):
    try:
        # Read the JSON file from S3
        response = s3_client.get_object(Bucket=bucket_name, Key=key)
        content = response['Body'].read().decode('utf-8')

        return content

    except Exception as e:
        print(f"Error reading text file from S3: {e}")
        return None

