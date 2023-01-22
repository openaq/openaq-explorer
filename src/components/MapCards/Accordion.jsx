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
      class={`${contentKey}-help-btn material-symbols-outlined ${
        open() ? 'white' : 'grey'
      }`}
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
  const [thresholdParameter, setThresholdParameter] = createSignal(2);
  const [thresholdValue, setThresholdValue] = createSignal(5);
  const [thressholdPeriod, setThressholdPeriod] = createSignal(1);

  const [
    store,
    { loadParameter, setMapThreshold, setMapThresholdActive },
  ] = useStore();

  function setThreshold() {
    setMapThreshold({
      active: true,
      parameter_id: thresholdParameter(),
      threshold: thresholdValue(),
      period: thressholdPeriod(),
    });
  }

  return (
    <AccordionProvider>
      <AccordionPanel
        name="pollutants"
        title="Pollutant"
        contentKey="pollutants"
        active={!store.mapThreshold.active}
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
                {parameter.displayName} {parameter.units}
              </option>
            )}
          </For>
        </select>
        <button
          className="btn btn-secondary"
          onClick={() => setMapThresholdActive(false)}
        >
          Update
        </button>
      </AccordionPanel>
      <AccordionPanel
        name="thresholds"
        title="Thresholds"
        contentKey="thresholds"
        active={store.mapThreshold.active}
      >
        <select
          name=""
          id=""
          className="select"
          onChange={(e) =>
            setThresholdParameter(parseInt(e.target.value))
          }
        >
          <option value="2" selected>
            PM 2.5
          </option>
          <option value="1">PM 10</option>
          <option value="3">O&#8323;</option>
        </select>
        <div className="thresholds-controls">
          <span className="thresholds-controls__item">Above</span>
          <select
            name=""
            id=""
            className="select thresholds-controls__item"
            onChange={(e) =>
              setThresholdValue(parseInt(e.target.value))
            }
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="100">100</option>
          </select>
          <span className="thresholds-controls__item">µg/m³</span>
        </div>
        <select
          name=""
          id=""
          className="select"
          onChange={(e) =>
            setThressholdPeriod(parseInt(e.target.value))
          }
        >
          <option value="1" selected>
            Last day
          </option>
          <option value="14" selected>
            Last 14 days
          </option>
          <option value="30">Last 30 days</option>
          <option value="90">last 90 days</option>
        </select>
        <button className="btn btn-secondary" onClick={setThreshold}>
          Update
        </button>
      </AccordionPanel>
    </AccordionProvider>
  );
}
