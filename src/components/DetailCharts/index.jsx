import LineChart from '../Charts/LineChart';
import AqiChart3 from '../Charts/AqiChart3';
import { useStore } from '../../stores';
import { BoxPlot, BoxPlotTooltip } from '../Charts/BoxPlot';
import { For } from 'solid-js';
import { ChartProvider } from '../Charts/BoxPlot';

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
        <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
          <h1 className="type-heading-1 text-sky-120">Patterns</h1>
          <span class="material-symbols-outlined text-ocean-120">
            help
          </span>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex; gap:12px; align-items: center;">
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
              <option value="">All time</option>
            </select>
            <button className="btn btn-secondary">Update</button>
          </div>
          <span className="chart-help">
            How was this chart calculated?
          </span>
        </div>
        <ChartProvider>
          <div style="position:relative;">
            <BoxPlotTooltip />
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
        </ChartProvider>
      </section>
      <section className="detail-charts__section">
        <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
          <h1 className="type-heading-1 text-sky-120">Thresholds</h1>
          <span class="material-symbols-outlined text-ocean-120">
            help
          </span>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex; gap:12px; align-items: center;">
            <select name="" id="" className="select">
              <For each={store.location?.parameters}>
                {(parameter, i) => (
                  <option
                    value={parameter.parameterId}
                    selected={parameter.parameterId == 2}
                  >
                    {parameter.displayName} ({parameter.unit})
                  </option>
                )}
              </For>
            </select>
            <span>above</span>
            <select name="" id="" className="select">
              <option value="">50</option>
              <option value="">100</option>
              <option value="">150</option>
              <option value="">200</option>
            </select>
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
        <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
          <h1 className="type-heading-1 text-sky-120">
            Air Quality Index
          </h1>
          <span class="material-symbols-outlined text-ocean-120">
            help
          </span>
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
          <AqiChart3
            width={1200}
            height={250}
            margin={60}
            data={recentMeasurements}
          />
        </div>
      </section>
    </div>
  );
}
