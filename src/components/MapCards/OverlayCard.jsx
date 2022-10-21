import { createSignal } from 'solid-js';
import { useStore } from '../../stores';
import Badge from '../Badge';
import ExpandableCard from './ExpandableCard';

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
      <div
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
      </div>
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

export default function OverlayCard() {
  const [store, { loadParameter }] = useStore();

  return (
    <ExpandableCard title={'Overlay'} open={true}>
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
          <For each={store.parameters}>
            {(parameter, idx) => (
              <option value="2" selected>
                {parameter.displayName}
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
          onChange={(e) => loadParameter(e.target.value)}
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
            onChange={(e) => loadParameter(e.target.value)}
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
            onChange={(e) => loadParameter(e.target.value)}
          >
            <option value="1" selected>
              Last 7 days
            </option>
            <option value="2">Last 30 days</option>
            <option value="3">last 90 days</option>
          </select>
        </div>
      </Accordion>
    </ExpandableCard>
  );
}
