import * as cdk from 'aws-cdk-lib';
import {
  aws_route53 as route53,
  aws_cloudfront as cloudfront,
  aws_route53_targets as targets,
  aws_certificatemanager as certificateManager,
  aws_lambda as lambda,
  aws_s3 as s3,
  aws_s3_deployment,
} from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import {
  DomainName,
  EndpointType,
  HttpMethod,
  SecurityPolicy,
} from 'aws-cdk-lib/aws-apigatewayv2';

import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { OriginProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

interface StackProps extends cdk.StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
  envName: string;
  certificateArn: string;
}


export class LambdaStack extends cdk.Stack {
  constructor(
    scope: Construct
    , id: string, 
    {
      hostedZoneId,
      hostedZoneName,
      domainName,
      envName,
      certificateArn,
      ...props
    }: StackProps
    ) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(
      this,
      `${id}-explorer-lambda`,
      {
        description: `lambda function explorer solid start ${id}`,
        code: lambda.Code.fromAsset('../.output'),
        handler: 'server/index.handler',
        memorySize: 1536,
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(15),
      }
    );

    const bucket = new s3.Bucket(this, `${id}-explorer-assets`, {
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const deployment = new aws_s3_deployment.BucketDeployment(
      this,
      `${id}-deployExplorerAssets`,
      {
        sources: [
          aws_s3_deployment.Source.asset('../.output/public'),
        ],
        destinationBucket: bucket,
      }
    );

    const certificate =
      certificateManager.Certificate.fromCertificateArn(
        this,
        `${id}-explorer-certificate`,
        certificateArn
      );

    const apiGatewayDomainName = new DomainName(
      this,
      `${id}-explorer-http-api-domain`,
      {
        domainName: domainName,
        certificate: certificate,
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      }
    );

    const apiGateway = new cdk.aws_apigatewayv2.HttpApi(
      this,
      `${id}-explorerHttpApi`,
      {
        description: `Connects the httpapiCloudFront distribution with the Lambda function to make it publicly available.`,
        corsPreflight: undefined,
        defaultDomainMapping: {
          domainName: apiGatewayDomainName,
        },
      }
    );

    apiGateway.addRoutes({
      integration: new HttpLambdaIntegration(
        `${id}explorerHttpApiIntegration`,
        lambdaFunction
      ),
      path: '/{proxy+}',
      methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.HEAD, HttpMethod.OPTIONS],
    });

    const apiUrl = `https://${apiGateway.httpApiId}.execute-api.${this.region}.amazonaws.com`;

    const originUrl = cdk.Fn.select(2, cdk.Fn.split('/', apiUrl));

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      `${id}explorerOriginAccessIdentity`
    );

    bucket.grantRead(originAccessIdentity);

    const distributionOriginRequestPolicy =
      new cloudfront.OriginRequestPolicy(
        this,
        `${id}-ExplorerSolidStartOriginRequestPolicy`,
        {
          originRequestPolicyName: `${id}ExplorerSolidStartOriginRequestPolicy`,
          queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
          cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
          headerBehavior: cloudfront.OriginRequestHeaderBehavior.all(),
        }
      );

    const defaultCachePolicy = new cloudfront.CachePolicy(
      this,
      `${id}explorerCachePolicy`,
      {
        defaultTtl: cdk.Duration.minutes(5),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all()
      }
    )

    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      `${id}explorerTestDistribution`,
      {
        httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        certificate: certificate,
        domainNames: [domainName],
        enableLogging: true,
        defaultBehavior: {
          cachePolicy: defaultCachePolicy,
          originRequestPolicy: distributionOriginRequestPolicy,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          origin: new cdk.aws_cloudfront_origins.HttpOrigin(
            originUrl, {
              connectionAttempts: 2,
              connectionTimeout: cdk.Duration.seconds(2),
              readTimeout: cdk.Duration.seconds(10),
              protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
          }
          ),
        },
        additionalBehaviors: {
          '/_build/*': {
            origin: new cdk.aws_cloudfront_origins.S3Origin(bucket, {
              originAccessIdentity: originAccessIdentity,
            }),
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          },
          '/svgs/*': {
            origin: new cdk.aws_cloudfront_origins.S3Origin(bucket, {
              originAccessIdentity: originAccessIdentity,
            }),
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          },
        },
      }
    );

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      `${id}explorerHostedZone`,
      {
        hostedZoneId: hostedZoneId,
        zoneName: hostedZoneName,
      }
    );

    const aliasRecord = new route53.ARecord(
      this,
      `${id}explorerAliasRecord`,
      {
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution)
        ),
        zone: hostedZone,
        recordName: domainName,
      }
    );
  }
}
