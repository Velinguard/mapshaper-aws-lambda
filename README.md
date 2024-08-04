# A simple AWS Lambda to host GeoJSON file reduction using [mapshaper](https://github.com/mbloch/mapshaper) and with an OpenAPI Specification

This is a simple implementation of a serverless node function which uses [https://github.com/mbloch/mapshaper](https://github.com/mbloch/mapshaper).

The API takes in a very simple json payload: 
```json
{
  "percentage": number,
  "map": GeoJSON Feature Collection
}
```
and returns a compressed GeoJSON Feature Collection.

## Setup

Update the following values: 

### Pre-Requisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured with your user token
- [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm?ref=sfeir.dev) installed (for testing)

#### S3 Bucket Creation

To create your S3 bucket run: 

```bash
#!/bin/bash
BUCKET_ID=$(dd if=/dev/random bs=8 count=1 2>/dev/null | od -An -tx1 | tr -d ' \t\n')
BUCKET_NAME=lambda-artifacts-$BUCKET_ID
echo $BUCKET_NAME > bucket-name.txt
aws s3 mb s3://$BUCKET_NAME
```

From: [AWS Developer Guide](https://github.com/awsdocs/aws-lambda-developer-guide/tree/main/sample-apps/nodejs-apig)

The bucket name here will be referred to as `$ARTIFACT_ID`

### api-spec.yaml

1. Update `servers.url` with the url defined by your API gateway.
2. Update `paths./.post.x-amazon-apigateway-integration.uri` to associate with your deployed lambda arn `$LAMBDA_ARN` and `$REGION`.

## Testing

The application does include a test you can run using jest, to run use:

```bash
cd function
npm install
npm run test
```

This will run automatically if using github actions.

The test data was obtained from [https://github.com/glynnbird/ukcountiesgeojson/blob/master/kent.geojson](https://github.com/glynnbird/ukcountiesgeojson/blob/master/kent.geojson)

## Deployment

### Locally

To deploy the lambda locally you can run: 

```bash
#!/bin/bash
set -eo pipefail
ARTIFACT_BUCKET=$(cat bucket-name.txt)

aws cloudformation package --template-file template.yml --s3-bucket $ARTIFACT_BUCKET --output-template-file out.yml
aws cloudformation deploy --template-file out.yml --stack-name nodejs-apig --capabilities CAPABILITY_NAMED_IAM
```

### Github Actions

The lambda supports native github action integration which includes running a unit test against an input file.

To enable github actions you need to define the following:

#### Variables

- `ARTIFACT_BUCKET` should be the arn associated with the bucket you set up in the first step.

#### Secrets

- `AWS_ACCESS_KEY_ID` the id of an AWS Access Key associated with the needed permissions (TODO: List what the min is)
- `AWS_SECRET_ACCESS_KEY` the associated key



