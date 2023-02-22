import { createSignal, createContext, useContext } from 'solid-js';
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

function ThresholdSelect() {
  const [thresholdParameter, setThresholdParameter] = createSignal(2); // initialize with PM25
  const [thresholdValue, setThresholdValue] = createSignal(5); // initialize at 5ugm3
  const [thressholdPeriod, setThressholdPeriod] = createSignal(14); // initialize at 14 days

  const [store, { setMapThreshold }] = useStore();

  function setThreshold() {
    setMapThreshold({
      active: true,
      parameter_id: thresholdParameter(),
      threshold: thresholdValue(),
      period: thressholdPeriod(),
    });
  }

  const parameters = [
    { value: 2, display: 'PM2.5' },
    { value: 1, display: 'PM10' },
    { value: 3, display: 'O₃' },
    { value: 5, display: 'NO₂' },
  ];
  const periods = [
    { value: 14, display: 'Last 14 days' },
    { value: 30, display: 'Last 30 days' },
    { value: 90, display: 'Last 90 days' },
  ];
  const thresholdValues = [
    { value: 5, display: 5, parameter: 2 },
    { value: 10, display: 10, parameter: 2 },
    { value: 250, display: 250, parameter: 2 },
    { value: 15, display: 15, parameter: 1 },
    { value: 20, display: 20, parameter: 1 },
    { value: 100, display: 100, parameter: 3 },
    { value: 10, display: 10, parameter: 5 },
    { value: 40, display: 40, parameter: 5 },
  ];

  const [thresholds, setThresholds] = createSignal(
    thresholdValues.filter((o) => o.parameter == 2)
  );

  function onParameterChange(e) {
    setThresholds(
      thresholdValues.filter((o) => o.parameter == e.target.value)
    );
    setThresholdValue(
      thresholdValues.filter((o) => o.parameter == e.target.value)[0]
        .value
    );
    setThresholdParameter(parseInt(e.target.value));
  }

  return (
    <>
      <select
        name=""
        id=""
        className="select"
        onChange={onParameterChange}
      >
        <For each={parameters}>
          {(parameter) => (
            <option value={parameter.value}>
              {parameter.display}
            </option>
          )}
        </For>
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
          <For
            each={thresholds().filter(
              (o) => o.parameter === thresholdParameter()
            )}
          >
            {(threshold, i) => (
              <option value={threshold.value} selected={i === 1}>
                {threshold.display}
              </option>
            )}
          </For>
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
        <For each={periods}>
          {(period, i) => (
            <option value={period.value} selected={i == 0}>
              {period.display}
            </option>
          )}
        </For>
      </select>
      <button className="btn btn-secondary" onClick={setThreshold}>
        Update
      </button>
    </>
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
        <ThresholdSelect />
      </AccordionPanel>
    </AccordionProvider>
  );
}
