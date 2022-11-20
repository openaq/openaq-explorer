import { createSignal } from 'solid-js';
import { useStore } from '../../stores';
import Badge from '../Badge';
import {
  LowCostSensorMarker,
  NoRecentUpdateMarker,
  ReferenceGradeMarker,
} from '../LocationMarker';
import Accordion from './Accordion';

/*
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
                visibility
              </span>
            </Badge>
          ) : (
            <span class="material-symbols-outlined smoke120">
              visibility_off
            </span>
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
*/

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
        <span class="material-symbols-outlined clickable-icon white">
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
  const [store, { loadParameter, toggleProviderList }] = useStore();

  return (
    <ExpandableCard open={true}>
      <div>
        <section>
          <Accordion />
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
                  className="checkbox"
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
                  className="checkbox"
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
                  className="checkbox"
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
                  className="checkbox"
                  checked
                />
              </div>
            </div>
          </div>
          <div>
            <div>
              <span>Showing data from {} providers</span>
            </div>
            <div>
              <button
                className="btn btn-secondary icon-btn"
                onClick={() => toggleProviderList(true)}
              >
                Choose data providers
                <span class="material-symbols-outlined green">
                  tune
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </ExpandableCard>
  );
}
