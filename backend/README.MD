A guide to the backend api for the chatbot. there is only one endpoint

# request structure

```
endpoint: GET 'https://l9zclxjcv7.execute-api.eu-central-1.amazonaws.com/dev/FullRAG'

headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY}

query_string_parameters : {'query': USERS_QUESTION}

```

# response
## successful response
```json
{
    "statusCode": 200,
    "body": {
        "response": "string - LLM response",
        "decisions" : [{
                "text":"string - the full decision text",
                "decision_url": "string - link to government decision page",
                "title":"string - short title of decision",
                "meeting_date": "timestamp structured like 2020-12-18T09:00:00Z",
                "score": "float - relevancy score between 0 & 1"
            }]
    }
}
```

## unsuccesful responses

query too long
```json
{
    "statusCode": 400,
    "body": "Vraag niet lang genoeg."
}
```
query too short
```json
{
    "statusCode": 400, 
    "body": "Vraag te lang."
}
```
no decisions used to generate response
```json
{
    "statusCode": 400,
    "body": "Sorry, maar ik kon geen relevante data vinden om uw vraag te kunnen beantwoorden. Mijn excuses."
}
```
generic backend error
```json
{
    "statusCode": 500,
    "body": "er is iets fout gegaan. Probeer het later opnieuw."
}
```

endpoint timed out (status 504)
```json
{
    "message": "Endpoint request timed out"
}
```
request quota exceeded (status 429)
```json
{
    "message": "Limit Exceeded"
}
```
