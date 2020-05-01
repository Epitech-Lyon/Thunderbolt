# AWS

Thunderbolt AWS part.

## Dependencies

  - `AWS account` configured
  - `AWS CLI`
  - `SAM CLI`

## Install

For `AWS CLI` please follow the [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

For `SAM CLI` linux installation, don't follow the AWS documentation. Just install `aws-sam-cli` using `pip`.

`pip install --upgrade pip && pip install --user aws-sam-cli`

## Deploy

We are using the `SAM` (Serverless Application Model) on top of `cloudFormation` service.

`./deploy.sh $project $region`

where:
  - `$project`: project name (must be lower case and '-' separated)
  - `$region` : AWS region deployement