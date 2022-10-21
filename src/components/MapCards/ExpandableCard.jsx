import { createSignal } from 'solid-js';
import { useStore } from '../../stores';
import Badge from '../Badge';
import {
  LowCostSensorMarker,
  NoRecentUpdateMarker,
  ReferenceGradeMarker,
} from '../LocationMarker';

function AccordionHelp({ contentKey, open }) {
  const [store, { toggleHelp, loadContent }] = useStore();

  const showHelp = (e) => {
    toggleHelp(true);
    loadContent(contentKey);
    e.stopPropagation();
  };

  return (
    <span
      class={`material-symbols-outlined ${open() ? 'white' : 'grey'}`}
      onClick={(e) => showHelp(e)}
    >
      help
    </span>
  );
}

function Accordion(props) {
  const [active, setActive] = createSignal(props.active || false);
  const [open, setOpen] = createSignal(props.open || false);

  const toggleOpen = () => {
    setOpen(!open());
  };

  return (
    <section className="accordion">
      <header
        className={`accordion__header ${
          open() ? 'accordion__header--open' : ''
        }`}
        onClick={toggleOpen}
      >
        <div className="header-section">
          <h3 className="accordion__header-title">{props.title}</h3>
          <AccordionHelp contentKey={props.contentKey} open={open} />
        </div>
        <div className="header-section">
          {active() ? (
            <Badge type={'active'}>
              <span>Active</span>
              <span class="material-symbols-outlined white">
                check
              </span>
            </Badge>
          ) : (
            ''
          )}
        </div>
      </header>
      <div
        className={`accordion__body ${
          open() ? 'accordion__body--open' : ''
        }`}
      >
        {props.children}
      </div>
    </section>
  );
}

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
      <div className="expandable-card__header" onClick={toggleOpen}>
        <div style="display:flex; align-items:center;">
          <span class="material-symbols-outlined white">layers</span>
          <h2 className="expandable-card__header-title">
            {open() ? 'Overlay' : 'Overlay & Filters'}
          </h2>
        </div>
        <span class="material-symbols-outlined icon white">
          {open() ? 'expand_less' : 'expand_more'}
        </span>
      </div>
      <div
        className={
          open()
            ? 'expandable-card__body--open'
            : 'expandable-card__body'
        }
      >
        {props.children}
      </div>
    </div>
  );
}

export default function FilterOverlayCard() {
  const [store, { loadParameter }] = useStore();

  return (
    <ExpandableCard open={true}>
      <div>
        <section>
          <Accordion
            title="Pollutant"
            contentKey="pollutants"
            active={true}
            open={true}
          >
            <select
              name=""
              id=""
              className="select"
              onChange={(e) => loadParameter(e.target.value)}
            >
              <For each={store.parameters()}>
                {(parameter, idx) => (
                  <option
                    value={parameter.id}
                    selected={parameter.id == store.parameter.id}
                  >
                    {parameter.displayName} {parameter.preferredUnit}
                  </option>
                )}
              </For>
            </select>
          </Accordion>
          <Accordion title="Air Quality Index" contentKey="aqi">
            <select
              name="aqi"
              id="aqi"
              className="select"
              onChange={(e) => loadParameterId(e.target.value)}
            >
              <option value="nowcast">US EPA NowCast</option>
            </select>
          </Accordion>
          <Accordion title="Thresholds" contentKey="thresholds">
            <div>
              <select
                name=""
                id=""
                className="select"
                onChange={(e) => loadOverlay(e.target.value)}
              >
                <option value="2" selected>
                  PM 2.5
                </option>
                <option value="1">PM 10</option>
                <option value="3">O&#8323;</option>
              </select>
            </div>
            <div>
              <span>Above</span>{' '}
              <select name="" id="" className="select">
                <option value="">100</option>
              </select>
              <span></span>{' '}
            </div>
            <div>
              <select
                name=""
                id=""
                className="select"
                onChange={(e) => loadOverlay(e.target.value)}
              >
                <option value="1" selected>
                  Last 7 days
                </option>
                <option value="2">Last 30 days</option>
                <option value="3">last 90 days</option>
              </select>
            </div>
          </Accordion>
        </section>
        <section className="filters-section">
          <header className="expandable-card__header">
            <div style="display:flex; align-items:center;">
              <span class="material-symbols-rounded white">
                filter_alt
              </span>
              <h2 className="expandable-card__header-title">
                Filters
              </h2>
            </div>
          </header>
          <div style="margin: 16px 15px;">
            <div style="width: 250px; display:grid; grid-template-columns: 1fr 4fr 1fr; grid-auto-rows: 1fr; row-gap: 8px; margin-bottom:12px;">
              <ReferenceGradeMarker />
              <label htmlFor="reference-grade">
                Reference grade locations
              </label>
              <div>
                <input
                  type="checkbox"
                  name="reference-grade"
                  id="reference-grade"
                  checked
                />
              </div>
              <LowCostSensorMarker />
              <label htmlFor="low-cost-sensor">
                {' '}
                Low-cost sensors locations
              </label>
              <div>
                <input
                  type="checkbox"
                  name="low-cost-sensor"
                  id="low-cost-sensor"
                  checked
                />
              </div>
              <NoRecentUpdateMarker />

              <label htmlFor="no-recent-updates">
                Show locations with no recent updates
              </label>
              <div>
                <input
                  type="checkbox"
                  name="no-recent-updates"
                  id="no-recent-updates"
                  checked
                />
              </div>
              <div style="background: #6A5CD8; height: 20px; width:20px; border-radius: 50%; margin:5px;"></div>
              <label htmlFor="poor-data-coverage">
                Show locations with Poor data coverage
              </label>
              <div>
                {' '}
                <input
                  type="checkbox"
                  name="poor-data-coverage"
                  id="poor-data-coverage"
                  checked
                />
              </div>
            </div>
            <select
              name=""
              id=""
              className="select"
              onChange={(e) => loadOverlay(e.target.value)}
            >
              <option value="1" selected>
                Show all data sources
              </option>
              <option value="2">US EPA Airnow</option>
              <option value="3">PurpleAir</option>
              <option value="2">Clarity</option>
              <option value="3">
                Breathe London Stationary Analysis
              </option>
              <option value="2">Arpalazio</option>
            </select>
          </div>
        </section>
      </div>
    </ExpandableCard>
  );
}
