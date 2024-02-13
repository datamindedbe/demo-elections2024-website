#!/bin/sh
rm -rf package
rm package.zip
mkdir -p package
pip install -r requirements-lambda.txt --force-reinstall --target ./package
cd package 
zip -r ../package.zip .
cd ..
zip package.zip lambda_function.py
zip package.zip config.py
zip -r package.zip src
aws --profile $AWS_PROFILE_NAME --region eu-central-1 lambda update-function-code \
    --function-name  electionsAIRetrieveDecisions \
    --zip-file fileb://package.zip