# Elections2024 website

## Prerequisites
- python >= 3.11
- Node & npm
- an AWS account (for s3 storage)
- an Open AI account / access token

## Introduction

The focus of the project is on Flemish politics, as such we use 2 sources of data:
-  [Regeerakkoord van de Vlaamse Regering 2019-2024](https://www.vlaanderen.be/publicaties/regeerakkoord-van-de-vlaamse-regering-2019-2024)
- The decisions made by the flemish government between 2019 & 2024 which can be found [here](https://beslissingenvlaamseregering.vlaanderen.be/)

Making use of a RAG (retrieval augmented generation) workflow we use an LLM to analyse the implementation of the government agreement(Regeerakkoord) by providing context from the relevant goverment decisions made. We present the results in a documentation website created with docusaurus.

As an additional interactive component we also have incorporated a chatbot which can be used to semantically search for specific government decisions

Note: We do not claim that the results produced in this project are complete and/or fully correct. This is an experimental project and the results should be interpretted in accordance with that.


## structure
elements of the folder structure relevant to running the project are shown below
```bash
root/
 |-- backend/
 |   |-- {SCRIPTS}.py
 |   |-- src/
 |   |-- scrapers/
 |-- data/
 |   |-- agreements_document/
 |   |-- llm_responses/
 |-- frontend/
 |   |-- docs/
 |   requirements.txt
```
The project is composed of 3 main folders:
### backend
in this folder are python scripts used for the purpose of ingesting relevant data and populating them into a vector database; generating responses from an llm and storing converting these responses to a structured format which can then be served by the frontend

### data
Under agreement_document/ is the RegeerAkkoord document both as a pdf and broken down in .txt sections

Under the llm_responses/ section are some intermediate llm results which are used in the process of generating the final website. 

### frontend
A Docusaurus project which serves the final markdown files (in the frontend/docs folder) via a static documentation website which can be served locally or hosted (setting up hosting is not configured within this repo)

## Running the project

running the project is broken up in a series of scripts. allowing for a particular step to be rerun and tweaked without going through the entire pipeline

### initial setup
- install the python dependencies given in requirements.txt with ```pip install -r requirements.txt``` in the root directory
- install docusaurus and related node dependencies by navigating into the frontend folder and running ```npm install```
- export a environment variable called ```AWS_PROFILE_NAME``` which indicates the aws profile to use
- export a environment variable called  ```OPENAI_API_KEY``` which is the api key for openai to use for running computing vector embeddings and llm responses
- all backend scripts should be run from within the backend folder, and frontend scripts should be run from the frontend folder to avoid path issues

### scraping decision data
The action required is to scrape the decision data from the government website. this is a two part process and involves running the scripts ```scrapers/ingest_decisions.py``` followed by ```scrapers/clean_decisions.py```. These scripts will read and write to an S3 bucket - the configuration for this step should be specified in the  file ```scrapers/config_scrapers.py```.

### populating the vector store
once the decision data is scraped we need to create and populate a vector store locally by running the script ```setup_db.py```. as a safety measure to avoid accidental override you first need to set the reprocess flags to true in the script for each vector store you wish to initialize.

### Generating LLM responses
Once the vector store has been populated you can generate generate LLM responses by running the ```generate_llm_responses.py``` script. this will produce the responses to a tmp folder. If you are happy with the responses and want to persist/process them further, copy the results to the ```data/llm_responses/agreement_adherence``` folder.

Note: this step can be both time and cost intensive. It is recommended to limit the number of responses to generate while iterating on a prompt with the variable ```TOPICS_LIMIT```

### Creating Markdown documents
first run the script ```llm_responses_to_json.py``` to restructure the llm responses for easier processing followed by the script ```generate_final_markdown.py``` which will create and load the final markdown files to the docs folder in the frontend

### Building and serving the documentation website
Lastly in order to serve your generated content
run:
```npm run docusaurus build``` followed by ```npm run docusaurus serve``` from within the frontend folder


## Configuring the chatbot
This is a feature still in development - so it will only be described at a high level.
A Knowledge base has been setup in AWS bedrock on the scraped decisions bucket (specifically the reduced clean decisions)
Within the backend folder is a lambda function which should be deployed as a AWS lambda function. this function interacts with the bedrock knowledge base.
In front of this we have an api gateway endpoint configured which recieves requests from chatbot component in the react frontend




