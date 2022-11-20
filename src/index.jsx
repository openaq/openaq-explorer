/* @refresh reload */

import { render } from 'solid-js/web';
import App from './App';
import { Provider } from './stores';
import 'mapbox-gl/dist/mapbox-gl.css';

render(
  () => (
    <Provider>
      <App />
    </Provider>
  ),
  document.body
);
