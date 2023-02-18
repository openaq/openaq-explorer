# OpenAQ Explorer



## Development


This project uses vite for building and bundling. Certain build variables are required in a root level `.env` file following the vite environment variable requirements. https://vitejs.dev/guide/env-and-mode.html

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

### Testing

End-to-end testing uses [Playwright](https://playwright.dev/)


To run the end-to-end test suite

```
yarn playwright test
```


## Deployment

Continuous deployment is handled by Github Actions.