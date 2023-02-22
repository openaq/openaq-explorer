import { createSignal } from 'solid-js';

export default function createMapBbox(
  client,
  actions,
  state,
  setState
) {
  const [bounds, setBounds] = createSignal();
  Object.assign(actions, {
    setBounds: (bounds) => setBounds(bounds),
  });

  return bounds;
}
