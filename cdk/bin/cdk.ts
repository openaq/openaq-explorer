#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack';
import * as dotenv from 'dotenv'

declare var process : {
  env: {
    VPC_ID: string
    HOSTED_ZONE_ID: string
    HOSTED_ZONE_NAME: string
    DOMAIN_NAME: string
    ENV_NAME: string
    CERTIFICATE_ARN: string
    CDK_ACCOUNT: string
    CDK_REGION: string
    REST_API_URL: string
  }
}

dotenv.config({path: '../.env'})

const app = new cdk.App();
const stack = new LambdaStack(app, `ExplorerLambdaStack-${process.env.ENV_NAME}`, {
  vpcId: process.env.VPC_ID,
  hostedZoneId: process.env.HOSTED_ZONE_ID,
  hostedZoneName:  process.env.HOSTED_ZONE_NAME,
  domainName:  process.env.DOMAIN_NAME,
  envName:  process.env.ENV_NAME,
  certificateArn: process.env.CERTIFICATE_ARN,
  lambdaEnv: {
    REST_API_URL: process.env.REST_API_URL
  },
  env: {
    account: process.env.CDK_ACCOUNT,
    region: process.env.CDK_REGION
  }
});

cdk.Tags.of(stack).add('project', 'openaq');
cdk.Tags.of(stack).add('product', 'explorer');
cdk.Tags.of(stack).add('env', process.env.ENV_NAME);

