import { createResource, createSignal } from 'solid-js';

export default function createDownload(
  client,
  actions,
  state,
  setState
) {
  const [parameters, setParameters] = createSignal();

  const [dateFrom, setDateFrom] = createSignal();

  const [dateTo, setDateTo] = createSignal();

  const [downloadFilters, setDownloadFilters] = createSignal();

  const [measurements] = createResource(
    downloadFilters,
    client.Measurements.get
  );
  Object.assign(actions, {
    setParameters(parameters) {
      setParameters(parameters);
    },
    setDateFrom(datetime) {
      setDateFrom(datetime);
    },
    setDateTo(datetime) {
      setDateTo(datetime);
    },
    fetchMeasurements() {
      setDownloadFilters({
        locationsId: state.location.id,
        dateFrom: dateFrom(),
        dateTo: dateTo(),
        parameters: parameters(),
      });
    },
  });

  return measurements;
}
