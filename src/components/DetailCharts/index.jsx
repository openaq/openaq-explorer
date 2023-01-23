import LineChart from '../Charts/LineChart';
import { useStore } from '../../stores';
import { BoxPlot, BoxPlotTooltip } from '../Charts/BoxPlot';
import { createSignal, For } from 'solid-js';
import { ChartProvider } from '../Charts/BoxPlot';

import ThresholdsChart from '../Charts/ThresholdsChart';

function LatestMeasurementsChart() {
  const [store] = useStore();
  const [selectedParameter, setSelectedParameter] = createSignal(
    store.location?.sensors[0].parameter.name
  );
  //const [selectTimePeriod, setSelectedTimePeriod] = createSignal();

  const [data, setData] = createSignal(
    store.recentMeasurements()
      ? store
          .recentMeasurements()
          .filter((o) => o.parameter == selectedParameter())
      : []
  );

  function updateChart() {
    if (store.recentMeasurements()) {
      let data = store
        .recentMeasurements()
        .filter((o) => o.parameter == selectedParameter())
        .filter(
          (o) =>
            new Date(o.date.utc) > new Date(Date.now() - 86400 * 1000)
        );
      setData(data);
    }
  }

  return (
    <>
      <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
        <h1 className="type-heading-1 text-sky-120">
          Latest Readings
        </h1>
        <span class="material-symbols-outlined text-ocean-120">
          help
        </span>
      </div>

      <div style="display:flex; justify-content: space-between;">
        <div style="display:flex; gap:12px; align-items: center;">
          <select
            name=""
            id=""
            className="select"
            onChange={(e) => setSelectedParameter(e.target.value)}
          >
            <For each={store.location?.sensors}>
              {(item, index) => (
                <option value={item.parameter.name}>
                  {item.parameter.name} ({item.parameter.units})
                </option>
              )}
            </For>
          </select>
          <select name="" id="" className="select">
            <option value="1">Last 24 hours</option>
          </select>
          <button className="btn btn-secondary" onClick={updateChart}>
            Update
          </button>
        </div>
        <span className="chart-help">
          How was this chart calculated?
        </span>
      </div>
      <div>
        <LineChart
          width={1200}
          height={250}
          margin={40}
          data={data()}
        />
      </div>
    </>
  );
}

function TrendsCharts() {
  const [store, { setHourTrendParams, setDayTrendParams }] =
    useStore();
  const [selectedParameter, setSelectedParameter] = createSignal(
    store.location?.sensors[0].parameter.id
  );

  setHourTrendParams({
    sensorNodesId: store.id,
    measurandsId: selectedParameter(),
    period: 'hour',
  });

  setDayTrendParams({
    sensorNodesId: store.id,
    measurandsId: selectedParameter(),
    period: 'day',
  });

  const [hourData, setHourData] = createSignal(
    store.hourTrends() ? store.hourTrends() : []
  );

  const [dayData, setDayData] = createSignal(
    store.dayTrends() ? store.dayTrends() : []
  );

  function updateCharts() {
    console.log('updates');
    console.log(store.hourTrends());
    if (store.hourTrends()) {
      setHourData(store.hourTrends());
    }
    if (store.dayTrends()) {
      setDayData(store.dayTrends());
    }
  }

  return (
    <>
      <div class="patterns-container" style="display: grid: "></div>
      <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
        <h1 className="type-heading-1 text-sky-120">Patterns</h1>
        <span class="material-symbols-outlined text-ocean-120">
          help
        </span>
      </div>

      <div style="display:flex; justify-content: space-between;">
        <div style="display:flex; gap:12px; align-items: center;">
          <select
            name=""
            id=""
            className="select"
            onChange={(e) => setSelectedParameter(e.target.value)}
          >
            <For each={store.location?.sensors}>
              {(sensor, i) => (
                <option value={sensor.parameter.id}>
                  {sensor.parameter.name} ({sensor.parameter.unit})
                </option>
              )}
            </For>
          </select>
          <select name="" id="" className="select">
            <option value="">All time</option>
          </select>
          <button
            className="btn btn-secondary"
            onClick={updateCharts}
          >
            Update
          </button>
        </div>
        <span className="chart-help">
          How was this chart calculated?
        </span>
      </div>
      <ChartProvider>
        <div style="position:relative;">
          <BoxPlotTooltip />
          <div style="display: grid; grid-template-columns: 1fr 1fr;">
            <div>
              <h3 className="type-header-3">Hour of day</h3>
              <BoxPlot
                name={'time-of-day'}
                width={350}
                height={350}
                data={hourData()}
                period="hour"
                margin={50}
              />
            </div>
            <div>
              <h3 className="type-header-3">Day of week</h3>
              <BoxPlot
                name={'day-of-week'}
                width={350}
                height={350}
                data={dayData()}
                period="day"
                margin={50}
              />
            </div>
          </div>
        </div>
      </ChartProvider>
    </>
  );
}

export default function DetailCharts() {
  return (
    <div className="detail-charts">
      <section className="detail-charts__section">
        <LatestMeasurementsChart />
      </section>
      <section className="detail-charts__section">
        <TrendsCharts />
      </section>
    </div>
  );
}
