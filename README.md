# OpenAQ Explorer

The OpenAQ Explorer is a web application for exploring open air quality
monitoring data available on the OpenAQ platform.

## Development

Explorer is built with the [SolidJS](https://www.solidjs.com/) fullstack
meta-framework [Solid Start](https://start.solidjs.com/).

### Linting and style

[ESLint](https://eslint.org/) is used for code linting, see
[eslint.config.js](eslint.config.js) for specifcs.
[Prettier](https://prettier.io/) is used for code style and formatting, see the
[.prettierrc](.prettierrc) file for specifics.

### Infrastructure and deployment

Explorer is deployed on Amazon Web Services (AWS) and uses AWS Lambda for
serverless compute, AWS S3 for static asset storage and AWS Cloudfront for CDN.
Infrastructure deployment and development is managed with AWS CDK and can be
found in the [cdk](cdk) directory.

```
                                                                    AWS VPC
                                                      ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                                                                             │
                                                      │
                                      ┌───────────┐      ┌───────────────┐   │
                                      │           │   │  │ AWS Lambda λ  │
                                  ┌──▶│ AWS HTTP  │◀────▶│               │   │
                                  │   │API Gateway│   │  │  Application  │
  ┌───────────┐    ┌───────────┐  │   │           │      │    server     │   │
  │           │    │           │  │   └───────────┘   │  └───────────────┘
  │AWS Route53│◀──▶│    AWS    │◀─┘                                          │
  │    DNS    │    │Cloudfront │◀───────────┐         │
  │           │    │           │            │            ┌───────────────┐   │
  └───────────┘    └───────────┘            │         │  │               │
                                            │            │    AWS S3     │   │
                                            └─────────┼─▶│ Static assets │
                                                         │               │   │
                                                      │  └───────────────┘
                                                                             │
                                                      │
                                                       ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Environment variables

Application configuration is managed with environment variables in a `.env` file
located at the project root. This file contains both configurations for the
application itself and the CDK deployment. If not deploying with CDK the CDK
specific values can be excluded. Application variables are prefixed with `VITE_`
to comply with the vite build process for reading and applying variables through
`import.meta.env.` syntax, read more about vite environment variables at
[https://vite.dev/guide/env-and-mode#env-variables](https://vite.dev/guide/env-and-mode#env-variables)

```sh
# Explorer application vite variables

VITE_API_BASE_URL=https://api.openaq.org
VITE_MAP_STYLE=https://example.com/styles.json
VITE_TILES_URL=https://example.com/locations/tiles
VITE_TILES_API_KEY=my-secret-tiles-api-key
VITE_EXPLORER_API_KEY=supersecretapikeysecretchangemeplease
VITE_SESSION_SECRET=supersecretsessionssecretchangemeplease
VITE_GEOCODE_URL=https://api.geocode.earth/v1/autocomplete
VITE_GEOCDE_API_KEY=geocode-earth-api-key
VITE_ENV=prod

# CDK variables

VPC_ID=vpc-42abcdefgh42
HOSTED_ZONE_ID=ABC42DEF42GH
HOSTED_ZONE_NAME=example.com
DOMAIN_NAME=explore.example.com
ENV_NAME=env-name
CERTIFICATE_ARN=arn:aws:acm:us-east-1:4242424242424:certificate/1234abc56-78defg9-10hijkl-mn1112
CDK_ACCOUNT=42
CDK_REGION=us-east-1

REST_API_URL=http://localhost:8080

```

### Local development

The application requires Node 20 for building and development.

After configuring the necesarry environment variables in the `.env` file,
install dependencies with npm:

```sh
npm install
```

To run a local development version run

```sh
npm run dev
```
