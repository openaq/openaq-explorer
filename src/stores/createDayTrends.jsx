import { createResource, createSignal } from 'solid-js';

export default function createDayTrends(
  client,
  actions,
  state,
  setState
) {
  const [trendParams, setTrendParams] = createSignal();

  let [dayTrends, { mutate }] = createResource(
    trendParams,
    client.Trends.get
  );

  Object.assign(actions, {
    setDayTrendParams: (params) => {
      mutate(null);
      setTrendParams({
        sensorNodesId: params.sensorNodesId,
        measurandsId: params.measurandsId,
        period: 'day',
      });
    },
  });

  return dayTrends;
}
