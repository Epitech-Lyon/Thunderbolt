# AWS

Thunderbolt AWS part.

All the AWS functions provided can't be HTTP trigger. They can only be invoked.

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

Philosophy [Infrastructure As Code](https://en.wikipedia.org/wiki/Infrastructure_as_code).

`./deploy.sh $project $region $matchUniqu $awsprofile`

where:
  - `$project`     : project name which will be used as prefix on resources (must be lowercase and '-' separated)
  - `$region`      : AWS region deployement
  - `$matchUniq`   : unqiu id to create the sam-build s3 bucket like follow -> `$project-$uniqu-sambuild`
  - `$awsprofile`  : the AWS profile you want use.

The different resources are prefixed with the project name.

example: `./deploy.sh thunderbolt eu-west-1 mysociety default`

## Action handled

| Service           | Basic power (start/stop) | Specific                                      |
|-------------------|--------------------------|-----------------------------------------------|
| `EC2`             | handled                  |                                               |
| `RDS`             | handled                  | instance classe                               |
| `AppStream(2.0)`  | handled                  |                                               |


## Given Sample

| Service           | Description                           |
|-------------------|---------------------------------------|
| `Lambda`          | SAM template for scheduled lambda     |
| `AppStream(2.0)`  | AppStream fleet auto-scaling          |