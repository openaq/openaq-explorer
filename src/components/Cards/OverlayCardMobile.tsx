import styles from './OverlayCardMobile.module.scss';

import {
  NoRecentUpdateMarker,
  ReferenceGradeMarker,
  LowCostSensorMarker,
} from '../LocationMarker';
import { useStore } from '~/stores';
import { createSignal } from 'solid-js';

export function OverlayCardMobile() {
  const [
    store,
    {
      toggleShowProvidersCard,
      setSelectedMapParameter,
      toggleShowOnlyActiveLocations,
      toggleAirSensor,
      toggleMonitor,
    },
  ] = useStore();

  const [parameter, setParameter] = createSignal("all")

  return (
    <div class={styles['overlay-card-mobile']}>
      <section class={styles['filter-section']}>
        <header class={styles['filter-section__header']}>
          <div class={styles['card-title']}>
            <img src="/svgs/filter_white.svg" alt="filter icon" />
            <h3>Filters</h3>
          </div>
        </header>
        <div class={styles['pollutant-select']}>
          <label for="parameter-select" class="type-subtitle-2">Choose a pollutant</label>
          <select
            class="select"
            name="parameter-select"
            id="parameter-select"
            onChange={(e) => setSelectedMapParameter(e.target.value)}
            value={parameter()}
          >
            <option value="all">Any pollutant</option>
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
            <option value="o3">O3</option>
            <option value="no2">NO2</option>
            <option value="so2">SO2</option>
            <option value="co">CO</option>
          </select>
        </div>
        <hr class="hr" />
        <div>
        <span class="type-subtitle-2">Choose location type</span>

   
        <div class={styles['filter-section__body']}>

          <ReferenceGradeMarker />
          <label
            class={styles['marker-legend-item']}
            for="reference-grade"
          >
            <span>Reference monitor locations</span>
            <input
              type="checkbox"
              name="reference-grade"
              id="reference-grade"
              class="checkbox"
              checked={store.showMonitors}
              onInput={toggleMonitor}
              disabled={!store.showAirSensors}
            />
          </label>
          <LowCostSensorMarker />
          <label
            class={styles['marker-legend-item']}
            for="low-cost-sensor"
          >
            Air sensors locations
            <input
              type="checkbox"
              name="low-cost-sensor"
              id="low-cost-sensor"
              class="checkbox"
              checked={store.showAirSensors}
              onInput={toggleAirSensor}
              disabled={!store.showMonitors}
            />
          </label>
          <NoRecentUpdateMarker />
          <label
            class={styles['marker-legend-item']}
            for="no-recent-updates"
          >
            Show locations with no recent updates
            <input
              type="checkbox"
              name="no-recent-updates"
              id="no-recent-updates"
              class="checkbox"
              checked={!store.showOnlyActiveLocations}
              onInput={toggleShowOnlyActiveLocations}
            />
          </label>
          </div>
          </div>
      </section>
    </div>
  );
}
