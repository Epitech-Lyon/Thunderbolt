#!/bin/sh

# Variables required : 
# project
# env
# bucket

echo $@

##
## Set the script controlflow
##

function RAISE()
{
    echo "A fatal error occured"
}

set -e

trap RAISE EXIT

##
## Start deploying
##

echo "-------- Create SAM bucket --------"

#aws s3api create-bucket --bucket $bucket --region $region --create-bucket-configuration LocationConstraint=$region

echo "-------- Deploy lambas and appstream fleet --------"

# sam build 
# 
# sam package \
#     --s3-bucket $bucket \
#     --output-template-file package.yml
# 
# sam deploy \
#     --template-file package.yml \
#     --stack-name $project-$env \
#     --capabilities CAPABILITY_NAMED_IAM \
#     --region $region \
#     --tags Project=$project Env=$env \
#     --parameter-override \
#         Project=$project \
#         Env=$env \

# rm -f package.yml