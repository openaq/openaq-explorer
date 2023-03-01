import { createResource, createSignal } from 'solid-js';

export default function createRecentMeasurements(
  client,
  actions,
  state
) {
  const [sensorNodesId, setSensorNodesId] = createSignal(
    () => state.id
  );

  const [recentMeasurements, { mutate }] = createResource(
    () => sensorNodesId(),
    client.Measurements.getRecent
  );

  Object.assign(actions, {
    loadRecentMeasurements(id) {
      mutate(null);
      setSensorNodesId(id);
    },
  });

  return recentMeasurements;
}
