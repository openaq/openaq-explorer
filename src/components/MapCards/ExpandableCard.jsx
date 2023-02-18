import { createSignal } from 'solid-js';
import { useStore } from '../../stores';
import {
  LowCostSensorMarker,
  NoRecentUpdateMarker,
  ReferenceGradeMarker,
} from '../LocationMarker';
import Accordion from './Accordion';

export function ExpandableCard(props) {
  const [open, setOpen] = createSignal(props.open || false);
  const [store] = useStore();

  const toggleOpen = () => setOpen(!open());

  return (
    <div
      className={`expandable-card ${
        store.help.active || store.id
          ? 'expandable-card--translate'
          : ''
      }`}
    >
      <div className="expandable-card__header">
        <div style="display:flex; align-items:center;">
          <span class="material-symbols-outlined white">layers</span>
          <h3 className="type-heading3 text-white">
            {open() ? 'Overlay' : 'Overlay & Filters'}
          </h3>
        </div>
      </div>
      <div
        className={
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
      loadParameter,
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
    <ExpandableCard open={true}>
      <Accordion />
      <section className="filters-section">
        <header className="expandable-card__header">
          <div style="display:flex; align-items:center;">
            <span class="material-symbols-rounded white">
              filter_alt
            </span>
            <h3 className="type-heading3 text-white">Filters</h3>
          </div>
        </header>
        <div style="margin: 16px 15px;">
          <div class="filters-section__body">
            <ReferenceGradeMarker />
            <label htmlFor="reference-grade">
              Reference monitor locations
            </label>
            <div class="marker-legend-item">
              <input
                type="checkbox"
                name="reference-grade"
                id="reference-grade"
                className="checkbox"
                checked={store.mapFilters.monitor}
                onChange={monitorCheck}
                disabled={!showAirSensors()}
              />
            </div>
            <LowCostSensorMarker />
            <label htmlFor="low-cost-sensor">
              {' '}
              Air sensors locations
            </label>
            <div class="marker-legend-item">
              <input
                type="checkbox"
                name="low-cost-sensor"
                id="low-cost-sensor"
                className="checkbox"
                checked={store.mapFilters.airSensor}
                onChange={sensorCheck}
                disabled={!showMonitors()}
              />
            </div>
            <NoRecentUpdateMarker />

            <label htmlFor="no-recent-updates">
              Show locations with no recent updates
            </label>
            <div class="marker-legend-item">
              <input
                type="checkbox"
                name="no-recent-updates"
                id="no-recent-updates"
                className="checkbox"
                onChange={noRecentUpdatesCheck}
              />
            </div>
          </div>
        </div>
        <div className="expandable-card__footer">
          <button
            className="btn btn-secondary icon-btn"
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
