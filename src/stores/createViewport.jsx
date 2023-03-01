import { createSignal } from 'solid-js';

export default function createViewport(client, actions) {
  const [viewport, setViewport] = createSignal({
    zoom: 1.2,
    center: [40, 20],
  });

  Object.assign(actions, {
    setViewport: (viewport) => setViewport(viewport),
  });

  return viewport;
}
