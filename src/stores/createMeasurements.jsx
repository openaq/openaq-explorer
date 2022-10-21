import { createResource, createSignal } from 'solid-js';

function foo(parameters) {
  let measurements = [];
  for (const parameter of parameters) {
    const [measurementSource, setMeasurementSource] = createSignal(
      {}
    );
    measurements.push(
      createResource(measurementSource, client.Measurements.getRecent)
    );
  }
  return measurements;
}

export default function createMeasurements(
  client,
  actions,
  state,
  setState
) {
  const [measurementSource, setMeasurementSource] = createSignal({});
  let measurements = createResource(
    measurementSource,
    client.Measurements.getRecent
  );

  Object.assign(actions, {
    loadLocation(id) {
      setState({ id });
      setLocationSource([id]);
    },
    clearLocation() {
      setState({ id: null });
      location = null;
    },
  });

  return location;
}
