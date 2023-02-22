# OpenAQ Explorer

![staging workflow](https://github.com/openaq/openaq-explorer/actions/workflows/deploy-develop.yml/badge.svg)
![prod workflow](https://github.com/openaq/openaq-explorer/actions/workflows/deploy-main.yml/badge.svg)

![explore-screenshot](https://user-images.githubusercontent.com/8487728/219827842-24082062-832d-45ae-8def-e58ffd6cd6e9.jpg)


## Development


This projcets use vite for building and bundling. Certain build variables are required in a root level `.env` file following the vite environment variable requirements. https://vitejs.dev/guide/env-and-mode.html

The `.env` file should contain the following variables:

```
VITE_MAPBOX_ACCESS_TOKEN=mapboxaccesstoken
VITE_API_BASE_URL=openaqapidomainurl
VITE_MAPBOX_STYLE=mapboxstyleurl
```

To run the development server:

```sh
yarn run dev
```

To run the end-to-end test suite

```
yarn playwright test
```

