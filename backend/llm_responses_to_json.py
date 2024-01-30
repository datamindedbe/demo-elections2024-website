# a dummy script to convert the LLM responses to JSON
# this should rather be something we do at generation time
# however, for now we don't have that implemented.

import json
import os

FOLDER_PATH = 'data/llm_responses/agreement_adherence/60k_token_context/'

for folder in os.listdir(FOLDER_PATH):
    input_file = FOLDER_PATH + folder + '/clean_response.md'

    if not os.path.isfile(input_file):
        continue

    with open(input_file, 'r') as f:
        data = f.read()
    body, remainder = data.split('## Referenties (s3 files)')
    refs_s3, refs_full = remainder.split('## Referenties (full text)')

    heading_body = body.split('##', maxsplit=1)
    if len(heading_body) == 2:
        heading, body = heading_body
    else:
        heading = ''
        body = heading_body[0]


    heading = heading.strip()
    body = body.strip()
    refs_full = refs_full.strip()
    refs_s3 = refs_s3.strip()

    with open(FOLDER_PATH + folder + '/clean_responses.json', 'w') as f:
        json.dump({'heading': heading,
                   'body': body,
                   'refs_full': refs_full,
                   'refs_s3': refs_s3
                   }, f)

        



