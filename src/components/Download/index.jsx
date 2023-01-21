import { For } from 'solid-js';
import { useStore } from '../../stores';

function measurementsCsv(data) {
  return data;
}

export default function DownloadCard() {
  const [
    store,
    { setParameters, setDateFrom, setDateTo, fetchMeasurements },
  ] = useStore();

  const downloadOnClick = () => {
    fetchMeasurements();
    if (store.measurementsDownload.resolved) {
      const csv = measurementsCsv(store.measurementsDownload);
      console.log(csv);
    }
  };

  return (
    <div style="position:relative;">
      <div
        className="bubble-lg"
        style="position:absolute; z-index:-1; bottom:-60px; left: -120px"
      ></div>
      <div
        className="bubble-sm"
        style="position:absolute; bottom:-139px; left: 60px"
      ></div>
      <article className="detail-charts" id="download-card">
        <section className="detail-charts__section">
          <div style="display:flex; justify-content: space-between;">
            <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
              <h3 className="type-heading-1 text-sky-120">
                Download & API
              </h3>
              <span class="material-symbols-outlined green">
                help
              </span>
            </div>
          </div>
          <h3 className="type-subtitle-1 text-sky-120">
            Download Data (CSV)
          </h3>
          <div style="display:grid; grid-template-rows: 1fr 1fr 1fr; gap: 12px; padding-bottom: 12px;">
            <div>
              <label htmlFor="datetime-from">Start date</label>
              <input
                type="date"
                name="datetime-from"
                id="datetime-from"
                onChange={(e) =>
                  setDateFrom(new Date(e.target.value))
                }
              />
              <label htmlFor="datetime-to">End date</label>
              <input
                type="date"
                name="datetime-to"
                id="datetime-to"
                onChange={(e) => setDateTo(new Date(e.target.value))}
              />
            </div>
            <select
              className="select"
              name="test"
              multiple
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions
                ).map(({ value }) => value);
                setParameters(values);
              }}
            >
              <For each={store.location?.sensors}>
                {(item, index) => (
                  <option value={item.parameter.name}>
                    {item.parameter.name}
                  </option>
                )}
              </For>
            </select>
            <div style="display:inline-block;">
              <button
                className="icon-btn btn-secondary"
                onClick={downloadOnClick}
              >
                Download CSV
                <span class="material-symbols-outlined">
                  cloud_download
                </span>
              </button>
            </div>
          </div>
        </section>
        <section className="detail-charts__section">
          <div style="display:grid; grid-template-rows: 1fr 1fr 1fr; gap: 12px;  padding-bottom: 24px;">
            <h3 className="type-subtitle-1 text-sky-120">API</h3>
            <span>
              https://api.openaq.org/v2/measurements?location_id=
              {store.location?.id}
            </span>
            <div style="display:inline-block;">
              <a
                href=""
                className="btn btn-secondary"
                style="display:inline;"
              >
                Try this link
              </a>
            </div>
            <h5 className="type-subtitle-3">
              What is the OpenAQ API?
            </h5>
            <p className="type-body-1">
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
