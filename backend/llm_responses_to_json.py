# a dummy script to convert the LLM responses to JSON
# this should rather be something we do at generation time
# however, for now we don't have that implemented.

import json
import os
from config import LLM_RESPONSE_PATH_OF_INTEREST
from src.vector_store import VectorCollection

decisions_collection = VectorCollection("decisions")


def merge_dicts(dict1, dict2):
    result = {}

    # Iterate through keys of both dictionaries
    for key in set(dict1) | set(dict2):
        # Merge inner dictionaries if key exists in both dictionaries
        result[key] = {**dict1.get(key, {}), **dict2.get(key, {})}

    return result


for folder in os.listdir(LLM_RESPONSE_PATH_OF_INTEREST):
    input_file = LLM_RESPONSE_PATH_OF_INTEREST + folder + "/clean_response.md"

    if not os.path.isfile(input_file):
        continue

    with open(input_file, "r") as f:
        data = f.read()
    body, remainder = data.split("## Referenties (s3 files)")
    refs_s3, refs_full = remainder.split("## Referenties (full text)")

    heading_body = body.split("##", maxsplit=1)
    if len(heading_body) == 2:
        heading, body = heading_body
    else:
        heading = ""
        body = heading_body[0]

    heading = heading.strip()
    body = body.strip()
    refs_full = refs_full.strip()
    refs_s3 = refs_s3.strip()

    references_s3_dict = {}
    references_full_dict = {}

    continue_flag = True
    while continue_flag:
        tmp = refs_s3.split("\n", maxsplit=1)
        if len(tmp) == 1:
            continue_flag = False
        else:
            refs_s3 = tmp[1]
        try:
            index, filename = tmp[0].split(":")
            index_clean = index.strip("\[\] ")
            filename_clean = filename.strip()
            references_s3_dict[index_clean] = {"s3_filename_clean": filename_clean}
        except:
            pass

    continue_flag = True
    while continue_flag:
        tmp = refs_full.split("\\[", maxsplit=1)
        if len(tmp) == 1:
            continue_flag = False
        else:
            refs_full = tmp[1]

        try:
            index, content = tmp[0].split(":", maxsplit=1)
            index_clean = index.strip("\[\]\\ ")
            content_clean = content.strip()
            references_full_dict[index_clean] = {"s3_clean_content": content_clean}
        except:
            pass
    references = merge_dicts(references_s3_dict, references_full_dict)

    for key, value in references.items():

        vector_store_item = decisions_collection.get_item(value["s3_filename_clean"])
        if vector_store_item is not None:
            references[key]["date"] = vector_store_item.metadata["date"]
            references[key]["s3_filename_ingested"] = vector_store_item.metadata[
                "s3_filename_ingested"
            ]
            references[key]["source_url"] = vector_store_item.metadata["source_url"]
            references[key]["source_title"] = vector_store_item.metadata["source_title"]

    with open(
        LLM_RESPONSE_PATH_OF_INTEREST + folder + "/clean_responses.json", "w"
    ) as f:
        json.dump({"heading": heading, "body": body, "references": references}, f)
