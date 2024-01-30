# a dummy script to convert the LLM responses to JSON
# this should rather be something we do at generation time
# however, for now we don't have that implemented.

import json
import os

def merge_dicts(dict1, dict2):
    result = {}

    # Iterate through keys of both dictionaries
    for key in set(dict1) | set(dict2):
        # Merge inner dictionaries if key exists in both dictionaries
        result[key] = {**dict1.get(key, {}), **dict2.get(key, {})}

    return result

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


    references_s3_dict = {} 
    references_full_dict = {}


    continue_flag = True
    while continue_flag:
        tmp = refs_s3.split('\n', maxsplit=1)
        if len(tmp) == 1:
            continue_flag = False
        else:
            refs_s3 = tmp[1]
        try:
            index, filename = tmp[0].split(':')
            index_clean = index.strip("\[\] ")
            filename_clean = filename.strip()
            references_s3_dict[index_clean] = {'s3_filename_clean': filename_clean}
        except:
            pass


    continue_flag = True
    while continue_flag:
        tmp = refs_full.split('\\[', maxsplit=1)
        if len(tmp) == 1:
            continue_flag = False
        else:
            refs_full = tmp[1]

        try:
            index, content = tmp[0].split(':', maxsplit=1)
            index_clean = index.strip("\[\]\\ ")
            content_clean = content.strip()
            references_full_dict[index_clean] = {'s3_clean_content': content_clean}
        except:
            pass
    references = merge_dicts(references_s3_dict, references_full_dict)

    for key, value in references.items():
        year, month, day = value['s3_filename_clean'].split('/')[-1].split('-')[:3]
        references[key]['date'] = f"{year}-{month}-{day}"

        document_id = value['s3_filename_clean'].split('-')[-1].rstrip('.txt')
        
        # add an implied s3 key ingested
        f"ingestion/output/{year}/{month}/{document_id}/document.json"
        references[key]['s3_filename_ingested'] = f"ingestion/output/{year}/{month}/{document_id}/document.json"



    with open(FOLDER_PATH + folder + '/clean_responses.json', 'w') as f:
        json.dump({'heading': heading,
                   'body': body,
                   'references': references
                   }, f)

        



