import LineChart from '../Charts/LineChart';
import { useStore } from '../../stores';
import Boxplot from '../Charts/BoxPlot';
import { createSignal, For, createReaction } from 'solid-js';

function calculateTimeDiff(hours) {
  return 60 * 60 * hours * 1000;
}

function LatestMeasurementsChart() {
  const [
    store,
    { setMeasurements, toggleHelp, loadContent, setScale },
  ] = useStore();
  const [selectedParameter, setSelectedParameter] = createSignal(
    store.location?.sensors[0].parameter.id
  );
  const [selectedScale, setSelectedScale] = createSignal('linear');

  const defaultTimePeriod = 24;
  const [selectedTimePeriod, setSelectedTimePeriod] =
    createSignal(defaultTimePeriod);
  const [dateFrom, setDateFrom] = createSignal(
    new Date(
      Date.now() - calculateTimeDiff(defaultTimePeriod)
    ).toISOString()
  );
  const [dateTo] = createSignal(new Date().toISOString()); // static for now

  const chartData = () =>
    store.measurements() ? store.measurements() : [];

  const trackName = createReaction(() => {
    setDateFrom(
      new Date(
        Date.now() - calculateTimeDiff(selectedTimePeriod())
      ).toISOString()
    );
    setMeasurements(
      store.location.id,
      selectedParameter(),
      dateFrom(),
      dateTo()
    );
    //setScale(selectedScale());
    setSelectedParameter(store.location?.sensors[0].parameter.id);
    setMeasurements(
      store.location.id,
      store.location?.sensors[0].parameter.id,
      dateFrom(),
      dateTo()
    );
  });

  const trackId = createReaction(() => onClickUpdate());

  trackName(() => store.location?.sensors[0].parameter.displayName);

  trackId(() => store.location?.id);

  const onClickUpdate = () => {
    setDateFrom(
      new Date(
        Date.now() - calculateTimeDiff(selectedTimePeriod())
      ).toISOString()
    );
    setMeasurements(
      store.location.id,
      selectedParameter(),
      dateFrom(),
      dateTo()
    );
    setScale(selectedScale());
  };

  if (store.location?.id) {
    onClickUpdate();
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          'align-items': 'center',
          margin: '24px 0',
          gap: '12px',
        }}
      >
        <h1 class="type-heading-1 text-sky-120">Latest Readings</h1>
        <button
          class="button-reset"
          style={{ display: 'flex' }}
          onClick={() => {
            toggleHelp(true);
            loadContent('lineChartHelp');
          }}
        >
          <span class="material-symbols-outlined">help</span>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          'justify-content': 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            'align-items': 'center',
          }}
        >
          <select
            name=""
            id=""
            class="select"
            onChange={(e) => setSelectedParameter(e.target.value)}
          >
            <For each={store.location?.sensors}>
              {(item) => (
                <option
                  value={item.parameter.id}
                  selected={selectedParameter() == item.parameter.id}
                >
                  {item.parameter.displayName} ({item.parameter.units}
                  )
                </option>
              )}
            </For>
          </select>
          <select
            name=""
            id=""
            class="select"
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
          >
            <option value="24">Last 24 hours</option>
            <option value="48">Last 48 hours</option>
            <option value="72">Last 72 hours</option>
            <option value="168">Last 1 week</option>
            <option value="720">Last 30 days</option>
          </select>
          <select
            name="scale-type"
            id="scale-type-select"
            class="select"
            onChange={(e) => setSelectedScale(e.target.value)}
          >
            <option value="linear" selected>
              Linear
            </option>
            <option value="log">Logarithmic</option>
          </select>
          <button class="btn btn-secondary" onClick={onClickUpdate}>
            Update
          </button>
        </div>
      </div>
      <div>
        <LineChart
          width={1200}
          height={250}
          margin={100}
          dateFrom={dateFrom()}
          dateTo={dateTo()}
          data={chartData()}
          scale={store.latestReadings}
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
      <div class="patterns-container" style={{ display: 'grid:' }} />
      <div
        style={{
          display: 'flex',
          'align-items': 'center',
          margin: '24px 0',
          gap: '12px',
        }}
      >
        <h1 class="type-heading-1 text-sky-120">Patterns</h1>
      </div>

      <div
        style={{
          display: 'flex',
          'justify-content': 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            'align-items': 'center',
          }}
        >
          <select
            name=""
            id=""
            class="select"
            onChange={(e) => setMeasurandsId(e.target.value)}
          >
            <For each={store.location?.sensors}>
              {(sensor) => (
                <option
                  value={sensor.parameter.id}
                  selected={() =>
                    measurandsId() == sensor.parameter.id
                  }
                >
                  {sensor.parameter.displayName} (
                  {sensor.parameter.units})
                </option>
              )}
            </For>
          </select>
          <select name="" id="" class="select">
            <option value="">All time</option>
          </select>
          <button
            class="btn btn-secondary"
            onClick={() => updateData()}
          >
            Update
          </button>
        </div>
      </div>
      <div
        style={{ display: 'flex', 'justify-content': 'space-around' }}
      >
        <div>
          <h3 class="type-header-3">Hour of day</h3>
          <Boxplot
            name={'time-of-day'}
            width={350}
            height={350}
            period="hour"
            margin={80}
            data={store.hourTrends}
          />
        </div>
        <div>
          <h3 class="type-header-3">Day of week</h3>
          <Boxplot
            name={'day-of-week'}
            width={350}
            height={350}
            period="day"
            margin={80}
            data={store.dayTrends}
          />
        </div>
      </div>
    </>
  );
}

export default function DetailCharts() {
  return (
    <div class="detail-charts">
      <section class="detail-charts__section">
        <LatestMeasurementsChart />
      </section>
      <section class="detail-charts__section">
        <TrendsCharts />
      </section>
    </div>
  );
}
