import * as cdk from 'aws-cdk-lib';
import {
  aws_route53 as route53,
  aws_cloudfront as cloudfront,
  aws_route53_targets as targets,
  aws_certificatemanager as certificateManager,
  aws_lambda as lambda,
  aws_s3 as s3,
  aws_s3_deployment,
  aws_ec2 as ec2, 
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

interface LambdaEnv { 
  [key: string]: string; 
}

interface StackProps extends cdk.StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
  envName: string;
  certificateArn: string;
  vpcId: string;
  lambdaEnv: LambdaEnv;
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
      vpcId, 
      lambdaEnv,
      ...props
    }: StackProps
    ) {
    super(scope, id, props);


    const vpc = ec2.Vpc.fromLookup(this, `${id}-explorer-vpc`, {
      vpcId: vpcId
    });


    const lambdaFunction = new lambda.Function(
      this,
      `${id}-explorer-lambda`,
      {
        description: `lambda function explorer solid start ${id}`,
        code: lambda.Code.fromAsset('../.output'),
        handler: 'server/index.handler',
        memorySize: 512,
        runtime: lambda.Runtime.NODEJS_20_X,
        architecture: lambda.Architecture.ARM_64,
        vpc: vpc,
        allowPublicSubnet: true,
        vpcSubnets: {subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS},
        timeout: cdk.Duration.seconds(10),
        environment: lambdaEnv
      }
    );

    const bucket = new s3.Bucket(this, `${id}-explorer-assets`, {
      bucketName: `${envName}-openaq-explorer-assets`,
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
          aws_s3_deployment.Source.asset('../.output/public')
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
        defaultTtl: cdk.Duration.minutes(0),
        minTtl: cdk.Duration.minutes(0),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all()
      }
    )

    let cspString = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io/js/script.js;
      style-src 'self' 'unsafe-inline';
      base-uri 'self';
      connect-src 'self' https://api.geocode.earth https://basemap.openaq.org https://plausible.io https://protomaps.github.io https://tiles.openaq.org;
      font-src 'self';
      frame-src 'none';
      img-src 'self' data:;
      worker-src blob:;`;

    cspString = cspString
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' ');


    // cloudfront response headers
    const responseHeadersPolicy =
      new cloudfront.ResponseHeadersPolicy(
        this,
        `ExploreResponseHeadersPolicy-${envName}`,
        {
          responseHeadersPolicyName: `ExploreResponseHeaderPolicy${envName}`,
          comment: 'Explore response header policy',
          corsBehavior: {
            accessControlAllowCredentials: false,
            accessControlAllowHeaders: ['*'],
            accessControlAllowMethods: ['GET', 'HEAD', 'OPTIONS'],
            accessControlAllowOrigins: ['*'],
            accessControlMaxAge: cdk.Duration.seconds(5),
            originOverride: true,
          },
          securityHeadersBehavior: {
            contentSecurityPolicy: {
              contentSecurityPolicy: cspString,
              override: true,
            },
            contentTypeOptions: { override: true },
            frameOptions: {
              frameOption: cloudfront.HeadersFrameOption.DENY,
              override: true,
            },
            referrerPolicy: {
              referrerPolicy:
                cloudfront.HeadersReferrerPolicy.ORIGIN,
              override: true,
            },
            strictTransportSecurity: {
              accessControlMaxAge: cdk.Duration.days(365),
              preload: true,
              includeSubdomains: true,
              override: true,
            },
            xssProtection: { protection: true, override: true },
          },
        }
      );


    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      `${id}OpenAQexplorerDistribution`,
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
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          responseHeadersPolicy: responseHeadersPolicy,
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
          '/images/*': {
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
          '/favicon.ico': {
            origin: new cdk.aws_cloudfront_origins.S3Origin(bucket, {
              originAccessIdentity: originAccessIdentity,
            }),
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          },
          '/favicon.svg': {
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
