import { createResource, createSignal } from 'solid-js';

export default function createDownload(client, actions, state) {
  const [downloadFilters, setDownloadFilters] = createSignal();

  const [measurementsDownload] = createResource(
    downloadFilters,
    client.Downloads.get
  );
  Object.assign(actions, {
    setParameters(parameters) {
      setDownloadFilters(() => ({
        parameters: parameters,
      }));
    },
    setDateFrom(datetime) {
      setDownloadFilters(() => ({
        dateFrom: datetime,
      }));
    },
    setDateTo(datetime) {
      setDownloadFilters(() => ({
        dateTo: datetime,
      }));
    },
    setDownloadFilters(dateFrom, dateTo, parameters) {
      setDownloadFilters({
        locationsId: state.location.id,
        dateFrom: dateFrom,
        dateTo: dateTo,
        parameters: parameters,
      });
    },
  });

  return measurementsDownload;
}
