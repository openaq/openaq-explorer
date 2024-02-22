// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';
import '~/assets/scss/main.scss';
import { Suspense } from 'solid-js';
import './App.module.scss';
import { StoreProvider } from '~/stores';

export default function App() {
  return (
    <StoreProvider>
      <Router
        singleFlight={true}
        root={(props) => (
          <>
            <Suspense>{props.children}</Suspense>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </StoreProvider>
  );
}
