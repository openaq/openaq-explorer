import {
  createSignal,
  For,
  createReaction,
  createEffect,
  on,
} from 'solid-js';
import { useStore } from '../../stores';
import { produce, createStore } from 'solid-js/store';
import dayjs from 'dayjs/esm/index.js';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

function downloadFile(filename, text) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);
  element.setAttribute('target', '_blank');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function measurementsCsv(data) {
  const results = JSON.parse(JSON.stringify(data));
  const values = results.map((o) => {
    return {
      locationId: o.locationId,
      location: o.location,
      parameter: o.parameter,
      value: o.value,
      dateUtc: o.date.utc,
      dateLocal: o.date.local,
      unit: o.unit,
      latitude: o.coordinates.latitude,
      longitude: o.coordinates.longitude,
      country: o.country,
      city: o.city,
      isMobile: o.isMobile,
      isAnalysis: o.isAnalysis,
      entity: o.entity,
      sensorType: o.sensorType,
    };
  });
  const fields = Object.keys(values[0]);
  const replacer = (key, value) => (value === null ? '' : value);
  let csv = values.map((row) =>
    fields
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(',')
  );
  csv.unshift(fields.join(','));
  csv = csv.join('\r\n');
  return csv;
}

export default function DownloadCard() {
  const [store, { setDownloadFilters }] = useStore();

  const [dateTo, setDateTo] = createSignal(new Date());
  const [dateFrom, setDateFrom] = createSignal(
    new Date(Date.now() - 86400000)
  );
  const allParameters = () =>
    store.location?.sensors.map((o) => o.parameter.name) ?? [];

  const [parameters, setParameters] = createStore(allParameters());

  const track = createReaction(() => {
    setParameters(
      store.location?.sensors.map((o) => o.parameter.name)
    );
  });

  track(() => store.location?.sensors);

  const downloadOnClick = () => {
    setDownloadFilters(dateFrom(), dateTo(), parameters);
  };

  createEffect(
    on(
      store.download,
      (download) => {
        const csv = measurementsCsv(download);
        downloadFile(`measurements_${store.id}.csv`, csv);
      },
      { defer: true }
    )
  );

  return (
    <div style={{ position: 'relative' }}>
      <div
        class="bubble-lg"
        style={{
          position: 'absolute',
          'z-index': '-1',
          bottom: '-60px',
          left: '-120px',
        }}
      />
      <div
        class="bubble-sm"
        style={{
          position: 'absolute',
          bottom: '-139px',
          left: '60px',
        }}
      />
      <article class="detail-charts" id="download-card">
        <section class="detail-charts__section">
          <div
            style={{
              display: 'flex',
              'justify-content': 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                'align-items': 'center',
                margin: '24px 0',
                gap: '12px',
              }}
            >
              <h3 class="type-heading-1 text-sky-120">
                Download & API
              </h3>
            </div>
          </div>
          <h3 class="type-subtitle-1 text-sky-120">
            Download Data (CSV)
          </h3>

          <div
            style={{
              'margin-top': '20px',
              display: 'flex',
              'flex-direction': 'column',
              gap: '32px',
              'padding-bottom': '12px',
            }}
          >
            <div>
              <label for="datetime-from">
                Start date
                <input
                  type="date"
                  name="datetime-from"
                  id="datetime-from"
                  class="date-input"
                  value={dateFrom().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setDateFrom(new Date(e.target.value))
                  }
                />
              </label>
              <label for="datetime-to">
                End date
                <input
                  type="date"
                  name="datetime-to"
                  id="datetime-to"
                  class="date-input"
                  value={dateTo().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setDateTo(new Date(e.target.value))
                  }
                />
              </label>
            </div>
            <div
              style={{
                display: 'grid',
                'grid-template-columns': '1fr 1fr',
                width: '250px',
                'row-gap': '15px',
              }}
            >
              <For each={store.location?.sensors}>
                {(sensor) => (
                  <>
                    <label for={`${sensor.parameter.name}-checkbox`}>
                      {sensor.parameter.displayName}
                      {sensor.parameter.units}
                    </label>
                    <input
                      type="checkbox"
                      name={`${sensor.parameter.name}-checkbox`}
                      id={`${sensor.parameter.name}-checkbox`}
                      class="checkbox"
                      checked
                      value={sensor.parameter.name}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setParameters(
                            produce((parameters) => {
                              parameters.push(e.target.value);
                            })
                          );
                        } else {
                          setParameters(
                            produce((parameters) => {
                              const idx = parameters.indexOf(
                                e.target.value
                              );
                              parameters.splice(idx, 1);
                            })
                          );
                        }
                      }}
                    />
                  </>
                )}
              </For>
            </div>
            <div style={{ display: 'inline-block' }}>
              <button
                class="icon-btn btn-secondary"
                onClick={downloadOnClick}
                disabled={store.download.loading}
              >
                Download CSV
                <span class="material-symbols-outlined">
                  cloud_download
                </span>
              </button>
              <span class="type-subtitle-3">
                {store.download.loading && 'Fetching data...'}
              </span>
            </div>
          </div>
        </section>
        <section class="detail-charts__section">
          <div
            style={{
              display: 'grid',
              'grid-template-rows': '1fr 1fr 1fr',
              gap: '12px',
              'padding-bottom': '24px',
            }}
          >
            <h3 class="type-subtitle-1 text-sky-120">API</h3>
            <span class="type-body-2">
              Measurements can be accessed programmatically via the
              OpenAQ API through this URL:
            </span>
            <span>
              https://api.openaq.org/v2/measurements?location_id=
              {store.location?.id}
              {() => (parameters.length > 0 ? '&' : '')}
              {parameters.map((o) => `parameter=${o}`).join('&')}
              &date_from=
              {dayjs
                .utc(dateFrom().toISOString().split('T')[0])
                .utcOffset(0, true)
                .format()}
              &date_to=
              {dayjs
                .utc(dateTo().toISOString().split('T')[0])
                .utcOffset(0, true)
                .format()}
              &limit=1000
            </span>
            <div style={{ display: 'inline-block' }}>
              <a
                href={`https://api.openaq.org/v2/measurements?location_id=${
                  store.location?.id
                }&${parameters.map((o) => `parameter=${o}`).join('&')}
                &date_from=
                ${dayjs
                  .utc(dateFrom().toISOString().split('T')[0])
                  .utcOffset(1, true)
                  .format()}&date_to=
                ${dayjs
                  .utc(dateTo().toISOString().split('T')[0])
                  .utcOffset(1, true)
                  .format()}&limit=1000`
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .join('')}
                class="btn btn-secondary"
                style={{ display: 'inline' }}
              >
                Try this link
              </a>
            </div>
            <h5 class="type-subtitle-3">What is the OpenAQ API?</h5>
            <p class="type-body-1">
              The OpenAQ API lets you access OpenAQ data directly and
              automatically, so you can use it in your own tools and
              applications. Learn more
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
