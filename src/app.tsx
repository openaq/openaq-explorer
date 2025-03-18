// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import '~/assets/scss/main.scss';
import { Suspense } from 'solid-js';
import '@fontsource/space-grotesk/300.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import { StoreProvider } from '~/stores';
import { MetaProvider, Title, Link, Meta } from '@solidjs/meta';

export default function App() {
  return (
    <StoreProvider>
      <Router
        singleFlight={true}
        root={(props) => (
          <MetaProvider>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </StoreProvider>
  );
}
