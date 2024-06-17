#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack';
import * as dotenv from 'dotenv'
import { AwsSolutionsChecks } from 'cdk-nag'
import { Aspects } from 'aws-cdk-lib';

declare var process : {
  env: {
    HOSTED_ZONE_ID: string
    HOSTED_ZONE_NAME: string
    DOMAIN_NAME: string
    ENV_NAME: string
    CERTIFICATE_ARN: string
  }
}

dotenv.config({path: '../.env'})

const app = new cdk.App();
const stack = new LambdaStack(app, 'ExplorerLambdaStack', {
  hostedZoneId: process.env.HOSTED_ZONE_ID,
  hostedZoneName:  process.env.HOSTED_ZONE_NAME,
  domainName:  process.env.DOMAIN_NAME,
  envName:  process.env.ENV_NAME,
  certificateArn: process.env.CERTIFICATE_ARN
});

cdk.Tags.of(stack).add('project', 'openaq');
cdk.Tags.of(stack).add('product', 'explorer');
cdk.Tags.of(stack).add('env', process.env.ENV_NAME);

