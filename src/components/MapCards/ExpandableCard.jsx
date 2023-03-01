import { createSignal } from 'solid-js';
import { useStore } from '../../stores';
import {
  LowCostSensorMarker,
  NoRecentUpdateMarker,
  ReferenceGradeMarker,
} from '../LocationMarker';
import Accordion from './Accordion';

export function ExpandableCard(props) {
  const [open] = createSignal(true);
  const [store] = useStore();

  return (
    <div
      class={`expandable-card ${
        store.help.active || store.id
          ? 'expandable-card--translate'
          : ''
      }`}
    >
      <div class="expandable-card__header">
        <div style={{ display: 'flex', 'align-items': 'center' }}>
          <span class="material-symbols-outlined white">layers</span>
          <h3 class="type-heading3 text-white">
            {open() ? 'Overlay' : 'Overlay & Filters'}
          </h3>
        </div>
      </div>
      <div
        class={
          open()
            ? 'expandable-card__body expandable-card__body--open'
            : 'expandable-card__body'
        }
      >
        {props.children}
      </div>
    </div>
  );
}

export default function FilterOverlayCard() {
  const [
    store,
    {
      toggleProviderList,
      toggleMonitor,
      toggleAirSensor,
      toggleInactive,
    },
  ] = useStore();

  const [showMonitors, setShowMonitors] = createSignal(true);
  const [showAirSensors, setShowAirSensors] = createSignal(true);

  const monitorCheck = (e) => {
    setShowMonitors(e.target.checked);
    toggleMonitor(e.target.checked);
  };

  const sensorCheck = (e) => {
    setShowAirSensors(e.target.checked);
    toggleAirSensor(e.target.checked);
  };

  const noRecentUpdatesCheck = (e) => {
    toggleInactive(e.target.checked);
  };

  return (
    <ExpandableCard>
      <Accordion />
      <section class="filters-section">
        <header class="expandable-card__header">
          <div style={{ display: 'flex', 'align-items': 'center' }}>
            <span class="material-symbols-rounded white">
              filter_alt
            </span>
            <h3 class="type-heading3 text-white">Filters</h3>
          </div>
        </header>
        <div style={{ margin: '16px 15px' }}>
          <div class="filters-section__body">
            <ReferenceGradeMarker />
            <label class="marker-legend-item" for="reference-grade">
              <span>Reference monitor locations</span>
              <input
                type="checkbox"
                name="reference-grade"
                id="reference-grade"
                class="checkbox"
                checked={store.mapFilters.monitor}
                onChange={monitorCheck}
                disabled={!showAirSensors()}
              />
            </label>
            <LowCostSensorMarker />
            <label class="marker-legend-item" for="low-cost-sensor">
              Air sensors locations
              <input
                type="checkbox"
                name="low-cost-sensor"
                id="low-cost-sensor"
                class="checkbox"
                checked={store.mapFilters.airSensor}
                onChange={sensorCheck}
                disabled={!showMonitors()}
              />
            </label>
            <NoRecentUpdateMarker />
            <label class="marker-legend-item" for="no-recent-updates">
              Show locations with no recent updates
              <input
                type="checkbox"
                name="no-recent-updates"
                id="no-recent-updates"
                class="checkbox"
                onChange={noRecentUpdatesCheck}
              />
            </label>
          </div>
        </div>
        <div class="expandable-card__footer">
          <button
            class="btn btn-secondary icon-btn"
            onClick={() => toggleProviderList(true)}
          >
            Choose data providers
            <span class="material-symbols-outlined green">tune</span>
          </button>
        </div>
      </section>
    </ExpandableCard>
  );
}
