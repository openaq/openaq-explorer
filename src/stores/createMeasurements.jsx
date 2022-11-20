import { createResource, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export default function createMeasurements(
  client,
  actions,
  state,
  setState
) {
  const [locationSource, setLocationSource] = createStore({});

  const [measurements] = createResource(
    () => locationSource,
    client.Measurements.getLocationMeasurements
  );
  /*
  const [measurementsSource, setMeasurementsSource] = createSignal({
    locationId: state.location?.id,
    parameters: state.location?.parameters.map((o) => o.id),
  });
  let measurements = createResource(
    () => {  },
    client.Measurements.getLocationMeasurements
  );
    */
  Object.assign(actions, {
    loadMeasurementsSource(locationId, parameters) {
      //setState({ locationId, parameters });
      //setLocationSource({
      //  locationId,
      //  parameters,
      //});
      //console.log(locationSource.locationId);
    },
  });

  return measurements;
}
