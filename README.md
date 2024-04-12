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
 |-- client/
 |-- data/
 |   |-- agreements_document/
 |   |-- llm_responses/
 |-- server/
 |   |-- assets/coalition-agreements/
 |   requirements.txt
```
The project is composed of 4 main folders:
### backend
in this folder are python scripts used for the purpose of ingesting relevant data and populating them into a vector database; generating responses from a llm and storing converting these responses to a structured format which can then be served by the frontend

### client
A React frontend to visualize the sections of the coalition agreement ("Regeerakkoord"), as well as provide a UI to interact with the chatbot.

### data
Under agreement_document/ is the RegeerAkkoord document both as a pdf and broken down in .txt sections

Under the llm_responses/ section are some intermediate llm results which are used in the process of generating the final website.

### server
A nodeJS with Typescript backend to serve the overview of sections in the coalition agreement ("Regeerakkoord") and to serve the contents of those sections, which can be found in the final markdown files (in "server/assets/coalition-agreements").

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
first run the script ```llm_responses_to_json.py``` to restructure the llm responses for easier processing followed by the script ```generate_final_markdown.py``` which will create and load the final markdown files to the assets folder in the backend

### Building and serving the website
In order to be able to build the website (front- and backend), it is necessary to install the dependencies for each part individually executing the following command `npm install --save-dev`, both in the 'server' and 'client' folder.
After installing the dependencies, the overview of categories in the coalition agreement (regeerakkoord) needs to be generated using the command `npm run generate:all` from inside the 'server' folder.

The frontend can be started by executing the command `npm run dev` from inside the client folder, while the NodeJS backend can be started in dev mode via `npm run start`. You can now browse to [http://localhost:3000](http://localhost:3000) to see the frontend application. The server has been started up on port 3001, except if a different port has been configured in the environment variable `PORT`.

Alternatively, the front- and NodeJS backend can be started up together using docker. The image can be build using the following command, executed in the root directory of this project: `docker build -t regeringsrobot .`. After building the image, the container can be started using the command `docker run -dp 127.0.0.1:3001:3001 regeringsrobot`. This command maps port 3001 from the host machine onto port 3001 of the container.

Note: the frontend is currently configured to use the deployed version of the Chatbot API.  The URL can be updated in /client/src/config/runtime-config.ts, in the function `getChatbotUrl`


## Chatbot deployment
more information regarding the specific deployment is available on this notion page for those with the relevant access
https://www.notion.so/datamindedbe/RegeringsRobot-ac07a73b829f427bbc42e99adff0b326
