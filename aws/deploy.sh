#!/bin/sh

# Variables required : 
# project
# region

echo $@

##
## Entry checkup
##

if [ $# -ne 2 ] || [ $1 == "--help" ]; then
    echo "$0 \$project \$region"
    exit 0
fi

project=$1
region=$2
bucket=$project-sambuild

if [[ ! "$project" =~ ^[a-z0-9\-]+$ ]]; then
    echo "Project name must match [a-z0-9\-]"
    exit 0
fi

##
## Environnement setup
##

BUILD="build"

mkdir -p $BUILD

##
## Set the script controlflow
##

function CLEANUP()
{
    rm -rf $BUILD
    rm -rf .aws-sam
}

function RAISE()
{
    echo "Process terminated, fatal error"
    CLEANUP
    exit 0
}

set -e

trap RAISE EXIT

##
## Start deploying
##

echo "-------- Create SAM bucket --------"

# aws s3api create-bucket --bucket $bucket --region $region --create-bucket-configuration LocationConstraint=$region

echo "-------- Deploy lambas --------"

sam build 

sam package \
    --s3-bucket $bucket \
    --output-template-file build/package.yml

sam deploy \
    --template-file build/package.yml \
    --stack-name $project \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $region \
    --tags Project=$project \
    --parameter-overrides \
        Project=$project \

CLEANUP

echo "We are done !"

trap - EXIT