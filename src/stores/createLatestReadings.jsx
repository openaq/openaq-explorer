import { createSignal } from 'solid-js';

export default function createLatestReadings(client, actions) {
  const [scale, setScale] = createSignal('linear');

  Object.assign(actions, {
    setScale: (scale) => {
      setScale(scale);
    },
  });

  return scale;
}
