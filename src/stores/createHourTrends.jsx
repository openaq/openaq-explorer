import { createResource, createSignal } from 'solid-js';

export default function createHourTrends(
  client,
  actions,
  state,
  setState
) {
  const [trendParams, setTrendParams] = createSignal();

  let [trends, { mutate }] = createResource(
    trendParams,
    client.Trends.get
  );

  Object.assign(actions, {
    setHourTrendParams: (params) => {
      mutate(null);
      setTrendParams({
        sensorNodesId: params.sensorNodesId,
        measurandsId: params.measurandsId,
        period: 'hour',
      });
    },
  });

  return trends;
}
