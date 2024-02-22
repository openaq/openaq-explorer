function TrendsCharts(props) {
  const [measurandsId, setMeasurandsId] = createSignal(
    store.location?.sensors[0].parameter.id
  );

  const sensorNodesId = store.id;

  function updateData() {
    setHourTrendParams({
      sensorNodesId: sensorNodesId,
      measurandsId: measurandsId(),
    });
  }
  setHourTrendParams({
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
            data={props}
          />
        </div>
      </div>
    </>
  );
}
