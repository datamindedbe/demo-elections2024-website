from datetime import date
import os

# scraper configuration - putting a perimeter around these variables for now until they are better integrated with the app in general
SCRAPER_DECISIONS_OUTPUT_S3_PREFIX = 'test/' # 'ingestion/output/' ideally
SCRAPER_DECISIONS_OUTPUT_S3_PREFIX_CLEAN = 'test_clean/' # 'clean/' ideally
SCRAPER_DECISIONS_OUTPUT_S3_BUCKET = 'genai-elections2024'
SCRAPER_DECISIONS_BASE_URL = "https://beslissingenvlaamseregering.vlaanderen.be"
SCRAPER_DECISIONS_INFO_TEMPLATE = SCRAPER_DECISIONS_BASE_URL + "/news-items/search?page%5Bsize%5D=100&page%5Bnumber%5D={page}&collapse_uuids=f&filter%5B%3Agte%2Clte%3AmeetingDate%5D={start}T22%3A00%3A00.000Z%2C{end}T22%3A59%3A59.000Z&sort%5BmeetingDate%5D=desc&sort%5BmeetingTypePosition%5D=asc&sort%5BagendaitemType%5D=desc&sort%5Bposition%5D=asc"
SCRAPER_DECISIONS_ATTACHMENT_TEMPLATE = SCRAPER_DECISIONS_BASE_URL + "/news-item-infos?filter%5B%3Aid%3A%5D={id}&include=attachments.file&page%5Bsize%5D=1"
SCRAPER_DECISIONS_START_DATE = date(2019, 10, 1)
SCRAPER_DECISIONS_AWS_PROFILE_NAME= os.environ.get('AWS_PROFILE_NAME')


SCRAPER_AGREEMENTS_REGEERAKKOORD_PDF_LOCATION = 'data/agreement_document/source/Regeerakkoord20192024.pdf'
SCRAPER_AGREEMENTS_OUTPUT_LOCATION = 'data/agreement_document/sections/raw/'