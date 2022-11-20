import LineChart from '../Charts/LineChart';
import { useStore } from '../../stores';
import BoxPlot from '../Charts/BoxPlot';
import { For } from 'solid-js';

import {
  dayOfWeek,
  hourOfDay,
  monthOfYear,
  recentMeasurements,
  thresholds,
} from './data';
import ThresholdsChart from '../Charts/ThresholdsChart';

export default function DetailCharts() {
  const [store] = useStore();

  return (
    <div className="detail-charts">
      <section className="detail-charts__section">
        <div style="display:flex; justify-content: space-between;">
          <div className="header-section">
            <h3 className="detail-section-title">Latest Readings</h3>
            <span class="material-symbols-outlined green">help</span>
          </div>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select">
              <For each={store.location?.parameters}>
                {(parameter, i) => (
                  <option value={parameter.id}>
                    {parameter.displayName} ({parameter.unit})
                  </option>
                )}
              </For>
            </select>
            <select name="" id="" className="select">
              <option value="1">Last 24 hours</option>
            </select>
            <button className="btn btn-secondary">Update</button>
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
            data={recentMeasurements}
          />
        </div>
      </section>
      <section className="detail-charts__section">
        <div class="patterns-container" style="display: grid: "></div>
        <div style="display:flex; justify-content: space-between;">
          <h3 className="detail-section-title">Patterns</h3>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select">
              <For each={store.location?.parameters}>
                {(parameter, i) => (
                  <option value={parameter.id}>
                    {parameter.displayName} ({parameter.unit})
                  </option>
                )}
              </For>
            </select>
            <select name="" id="" className="select"></select>
            <button className="btn btn-secondary">Update</button>
          </div>
          <span className="chart-help">
            How was this chart calculated?
          </span>
        </div>
        <div>
          <BoxPlot
            name={'time-of-day'}
            width={350}
            height={350}
            data={hourOfDay}
            margin={50}
          />
          <BoxPlot
            name={'day-of-week'}
            width={350}
            height={350}
            data={dayOfWeek}
            margin={50}
          />
          <BoxPlot
            name={'month-of-year'}
            width={350}
            height={350}
            data={monthOfYear}
            margin={50}
          />
        </div>
      </section>
      <section className="detail-charts__section">
        <div style="display:flex; justify-content: space-between;">
          <h3 className="detail-section-title">Thresholds</h3>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select">
              <For each={store.location?.parameters}>
                {(parameter, i) => (
                  <option value={parameter.id}>
                    {parameter.displayName} ({parameter.unit})
                  </option>
                )}
              </For>
            </select>
            <span>above</span>
            <select name="" id="" className="select"></select>
            <span>µg/m3</span>
            <input type="date" name="" id="" />
            <button className="btn btn-secondary">Update</button>
          </div>
          <span className="chart-help">
            How was this chart calculated?
          </span>
        </div>
        <div>
          <ThresholdsChart
            name={'thresholds'}
            width={1200}
            height={250}
            margin={60}
            data={thresholds}
          />
        </div>
      </section>
      <section className="detail-charts__section">
        <div style="display:flex; justify-content: space-between;">
          <h3 className="detail-section-title">Air Quality Index</h3>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select">
              <option value="">US EPA NowCast PM</option>
            </select>
            <input type="date" name="" id="" />
            <button className="btn btn-secondary">Update</button>
          </div>
          <span className="chart-help">
            How was this chart calculated?
          </span>
        </div>
        <div>
          <svg height="250"></svg>
        </div>
      </section>
    </div>
  );
}
