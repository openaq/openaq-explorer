import { createResource, createSignal } from 'solid-js';

export default function createRecentMeasurements(
  client,
  actions,
  state,
  setState
) {
  const [recentMeasurements] = createResource(
    () => state.id,
    client.Measurements.getRecent
  );

  Object.assign(actions, {});

  return recentMeasurements;
}
