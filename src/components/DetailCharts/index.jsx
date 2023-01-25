import LineChart from '../Charts/LineChart';
import { useStore } from '../../stores';
import Boxplot from '../Charts/BoxPlot';
import { createSignal, For } from 'solid-js';

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

  const [measurandsId, setMeasurandsId] = createSignal(
    store.location?.sensors[0].parameter.id
  );

  const sensorNodesId = store.id;

  function updateData() {
    setHourTrendParams({
      sensorNodesId: sensorNodesId,
      measurandsId: measurandsId(),
    });
    setDayTrendParams({
      sensorNodesId: sensorNodesId,
      measurandsId: measurandsId(),
    });
  }
  setHourTrendParams({
    sensorNodesId: sensorNodesId,
    measurandsId: 2,
  });

  setDayTrendParams({
    sensorNodesId: sensorNodesId,
    measurandsId: 2,
  });

  return (
    <>
      <div class="patterns-container" style="display: grid: "></div>
      <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
        <h1 className="type-heading-1 text-sky-120">Patterns</h1>
      </div>

      <div style="display:flex; justify-content: space-between;">
        <div style="display:flex; gap:12px; align-items: center;">
          <select
            name=""
            id=""
            className="select"
            onChange={(e) => setMeasurandsId(e.target.value)}
          >
            <For each={store.location?.sensors}>
              {(sensor, i) => (
                <option value={sensor.parameter.id}>
                  {sensor.parameter.name} ({sensor.parameter.units})
                </option>
              )}
            </For>
          </select>
          <select name="" id="" className="select">
            <option value="">All time</option>
          </select>
          <button
            className="btn btn-secondary"
            onClick={() => updateData()}
          >
            Update
          </button>
        </div>
      </div>
      <div style="display: flex; justify-content: space-around;">
        <div>
          <h3 className="type-header-3">Hour of day</h3>

          <Boxplot
            name={'time-of-day'}
            width={350}
            height={350}
            period="hour"
            margin={50}
            data={store.hourTrends}
          />
        </div>
        <div>
          <h3 className="type-header-3">Day of week</h3>
          <Boxplot
            name={'day-of-week'}
            width={350}
            height={350}
            period="day"
            margin={50}
            data={store.dayTrends}
          />
        </div>
      </div>
    </>
  );
}

export default function DetailCharts(props) {
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
