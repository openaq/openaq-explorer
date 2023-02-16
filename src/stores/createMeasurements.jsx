import { createResource, createSignal, batch } from 'solid-js';

export default function createMeasurements(
  client,
  actions,
  state,
  setState
) {
  const [locationsId, setLocationsId] = createSignal();
  const [parameter, setParameter] = createSignal();
  const [dateFrom, setDateFrom] = createSignal();
  const [dateTo, setDateTo] = createSignal();

  const fetchParams = () => {
    if (locationsId() && parameter() && dateFrom() && dateTo) {
      return {
        locationsId: locationsId(),
        parameter: parameter(),
        dateFrom: dateFrom(),
        dateTo: dateTo(),
      };
    }
  };

  const [measurements, { mutate }] = createResource(
    fetchParams,
    client.Measurements.get
  );
  Object.assign(actions, {
    setMeasurements(locationsId, parameter, dateFrom, dateTo) {
      mutate([]);
      batch(() => {
        setLocationsId(locationsId);
        setParameter(parameter);
        setDateFrom(dateFrom);
        setDateTo(dateTo);
      });
    },
  });

  return measurements;
}
