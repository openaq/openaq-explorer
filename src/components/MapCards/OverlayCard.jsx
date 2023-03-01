import { createSignal, For } from 'solid-js';
import { useStore } from '../../stores';
import Badge from '../Badge';
import ExpandableCard from './ExpandableCard';

function AccordionHelp(props) {
  const [, { toggleHelp, loadContent }] = useStore();

  const showHelp = (e) => {
    toggleHelp(true);
    loadContent(props.contentKey);
    e.stopPropagation();
  };

  return (
    <span
      class={`material-symbols-outlined ${
        props.open() ? 'white' : 'grey'
      }`}
      onClick={(e) => showHelp(e)}
    >
      help
    </span>
  );
}

function Accordion(props) {
  const [active] = createSignal(props.active || false);
  const [open, setOpen] = createSignal(props.open || false);

  const toggleOpen = () => {
    setOpen(!open());
  };

  return (
    <section class="accordion">
      <div
        class={`accordion__header ${
          open() ? 'accordion__header--open' : ''
        }`}
        onClick={toggleOpen}
      >
        <div class="header-section">
          <h3 class="accordion__header-title">{props.title}</h3>
          <AccordionHelp contentKey={props.contentKey} open={open} />
        </div>
        <div class="header-section">
          {active() ? (
            <Badge type={'status-ok'}>
              Active " "
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
        class={`accordion__body ${
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
          class="select"
          onChange={(e) => loadParameter(e.target.value)}
        >
          <For each={store.parameters}>
            {(parameter) => (
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
          class="select"
          onChange={(e) => loadParameter(e.target.value)}
        >
          <option value="nowcast">US EPA PM NowCast</option>
          <option value="nowcast">US EPA Ozone NowCast</option>
        </select>
      </Accordion>
      <Accordion title="Thresholds" contentKey="thresholds">
        <div>
          <select
            name=""
            id=""
            class="select"
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
          <select name="" id="" class="select">
            <option value="">100</option>
          </select>
          <span />{' '}
        </div>
        <div>
          <select
            name=""
            id=""
            class="select"
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
