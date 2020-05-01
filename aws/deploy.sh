#!/bin/sh

# Variables required : 
# project
# region
# bucket

echo $@

##
## Entry checkup
##

if [ $# -ne 3 ] || [ $1 == "--help" ]; then
    echo "./$0  \$project \$region"
fi

project=$1
region=$2

if [[ ! "$project" =~ ^[a-z0-9\-]+$ ]]; then
    echo "Project name must match [a-z0-9\-]"
    exit 0
fi

##
## Set the script controlflow
##

function RAISE()
{
    echo "A fatal error occured"
    exit 0
}

set -e

trap RAISE EXIT

##
## Start deploying
##

echo "-------- Create SAM bucket --------"

aws s3api create-bucket --bucket $project-$bucket --region $region --create-bucket-configuration LocationConstraint=$region

echo "-------- Deploy lambas --------"

sam build 

sam package \
    --s3-bucket $bucket \
    --output-template-file package.yml

sam deploy \
    --template-file package.yml \
    --stack-name $project \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $region \
    --tags Project=$project \
    --parameter-override \
        Project=$project \

rm -f package.yml