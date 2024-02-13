# script to populate setup the chromadb data and populate it
# once off script
import glob
import pathlib
import json
import urllib
from src.vector_store import VectorCollection
from src.aws import list_s3_files, read_txt_from_s3
from src.util import title_to_url

from config import AGREEMENTS_PATH, DECISIONS_S3_BUCKET, DECISIONS_S3_PREFIX_CLEAN

# set these flags to true to re-/initialize the vector collections from scratch
# note that this will take a while
REPROCESS_AGREEMENTS = False
REPROCESS_DECISIONS = False


if REPROCESS_AGREEMENTS:
    agreements_collection = VectorCollection(name="agreements", metadata={"hnsw:space": "cosine"})
    print("Adding agreements")
    for id_n, txtfile in enumerate(glob.glob(AGREEMENTS_PATH+'*.txt')):
        with open(txtfile) as f:
            data = f.read()
        filepath = pathlib.Path(txtfile)
        print(f"Processing {filepath.stem}")

        agreements_collection.add_item(
            document=data,
            metadata={"source": "regeerakkoord2019"},
            id=f"{txtfile}" #use the name of the file as it id
        )

if REPROCESS_DECISIONS:
    decisions_collection = VectorCollection(name="decisions", metadata={"hnsw:space": "cosine"})
    file_list = list_s3_files(bucket_name=DECISIONS_S3_BUCKET, prefix=DECISIONS_S3_PREFIX_CLEAN)
    print(file_list[:10])
    print(f"{len(file_list)} cleaned files on s3 to embed")
    for idx, filename in enumerate(file_list):
        print(f"processed {idx} files out of {len(file_list)}")


        if filename.endswith('.txt'):
            clean_contents = read_txt_from_s3(DECISIONS_S3_BUCKET, filename)
            if not clean_contents:
                continue

            year, month, day = filename.split('/')[-1].split('-')[:3]
            date = f"{year}-{month}-{day}"
            document_id = filename.split('-')[-1].rstrip('.txt')
            ingested_file_key = f"ingestion/output/{year}/{month}/{document_id}/document.json"
            ingestion_contents = read_txt_from_s3(DECISIONS_S3_BUCKET, ingested_file_key)

            if ingestion_contents:
                ingestion_contents = json.loads(ingestion_contents)
                source_title = ingestion_contents['attributes']['title']
                source_date = ingestion_contents['attributes']['meetingDate']
                source_url = title_to_url(source_title, source_date)
            else:
                source_url = ''
                source_title = ''

            decisions_collection.add_item(
                    document=clean_contents,
                    metadata={"source_title": source_title,
                              "source_url": source_url,
                              "date": date,
                              "s3_filename_ingested": ingested_file_key,
                              "s3_filename_clean": filename},
                    id=f"{filename}"
            )
