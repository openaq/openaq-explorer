import {
  createSignal,
  createContext,
  useContext,
  createEffect,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { useStore } from '../../stores';
import Badge from '../Badge';

const AccordionContext = createContext();

function AccordionProvider(props) {
  const [activePanel, setActivePanel] = createStore({
      name: 'pollutants',
    }),
    accordion = [
      activePanel,
      {
        togglePanel(panel) {
          setActivePanel({ name: panel });
        },
      },
    ];

  return (
    <AccordionContext.Provider value={accordion}>
      {props.children}
    </AccordionContext.Provider>
  );
}

function useAccordion() {
  return useContext(AccordionContext);
}

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

function AccordionPanel(props) {
  const [activePanel, { togglePanel }] = useAccordion();

  const open = () => activePanel.name == props.name;

  return (
    <section className="accordion">
      <header
        className={`accordion__header ${
          open() ? 'accordion__header--open' : ''
        }`}
        onClick={() => {
          togglePanel(props.name);
        }}
      >
        <div className="header-section">
          <h3 className="accordion__header-title">{props.title}</h3>
          <AccordionHelp contentKey={props.contentKey} open={open} />
        </div>
        <div className="header-section">
          {props.active ? (
            <Badge type={'status-ok'}>
              Active
              <span class={`material-symbols-outlined white`}>
                visibility
              </span>
            </Badge>
          ) : (
            <span
              class={`material-symbols-outlined ${
                open() ? 'white' : 'smoke120'
              }`}
            >
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

export default function Accordion() {
  const [store, { loadParameter }] = useStore();

  return (
    <AccordionProvider>
      <AccordionPanel
        name="pollutants"
        title="Pollutant"
        contentKey="pollutants"
        active={true}
        open={true}
      >
        <select
          name=""
          id=""
          className="select"
          onChange={(e) => {
            console.log(store);
            loadParameter(e.target.value);
          }}
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
        <button className="btn btn-secondary">Update</button>
      </AccordionPanel>
      <AccordionPanel
        name="aqi"
        title="Air Quality Index"
        contentKey="aqi"
      >
        <select
          name="aqi"
          id="aqi"
          className="select"
          onChange={(e) => loadParameterId(e.target.value)}
        >
          <option value="nowcast">US EPA PM NowCast</option>
          <option value="nowcast">US EPA Ozone NowCast</option>
        </select>
        <button className="btn btn-secondary">Update</button>
      </AccordionPanel>
      <AccordionPanel
        name="thresholds"
        title="Thresholds"
        contentKey="thresholds"
      >
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
          <button className="btn btn-secondary">Update</button>
        </div>
      </AccordionPanel>
    </AccordionProvider>
  );
}
