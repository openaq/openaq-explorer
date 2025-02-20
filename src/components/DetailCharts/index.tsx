import { For, createEffect, createSignal, onMount } from 'solid-js';
import { getSensorMeasurements, getSensorTrends } from '~/client';
import LineChart from '../Charts/LineChart';
import Boxplot from '../Charts/BoxPlot';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import NestClock from '~/assets/imgs/nest_clock.svg';


import '~/assets/scss/components/detail-charts.scss';


dayjs.extend(utc);
dayjs.extend(tz);

interface Parameter {
  id: number;
  name: string;
  units: string;
  displayName: string;
}

interface Sensor {
  id: number;
  name: string;
  parameter: Parameter;
}

interface Datetime {
  utc: string;
  local: string;

}

interface DetailChartsDefinition {
  id: number;
  timezone: string;
  sensors: Sensor[];
  datetimeFirst: Datetime;
  datetimeLast: Datetime;
}

function calculateTimeDiff(hours: number): number {
  return 60 * 60 * hours * 1000;
}

function getYears(datetimeFirst: string, datetimeLast: string): string[] {
  const years = dayjs(datetimeLast).diff(datetimeFirst,'year');
  const firstYear = dayjs(datetimeFirst).year()
  return Array.from({length: years + 1}, (_, i) => String(i + firstYear)).reverse()

}


interface TimezoneDisclaimerDefinition {
  timezone: string;
}

function TimezoneDisclaimer(props: TimezoneDisclaimerDefinition) {
  return(
    <div class="timezone-disclaimer">
      <NestClock width={24} height={24} fill='#5a6672' role="img"/> 
    <span>
      Chart shows local times ({props.timezone} UTC{dayjs(new Date()).tz(props.timezone).format('Z')})
    </span>
    </div>

  )
                

}

export function DetailCharts(props: DetailChartsDefinition) {


  const [clientWidth, setClientWidth] = createSignal<number>(0)
  const [xTicks, setXTicks] = createSignal(24)

  onMount(() => {
    setClientWidth(document.body.clientWidth)
  });

  const chartWidth = () => {
    if (clientWidth() <  800) {
      setXTicks(4)
      return 300;

    }
    if (clientWidth() <  1200) {
      setXTicks(12)

      return 800;
    }
    setXTicks(24)

    return 1200;
  } 


  const [selectedSensor, setSelectedSensor] = createSignal(
    props.sensors?.[0].id
  );
  const [loading, setLoading] = createSignal(true);
  const [sensorsId, setSensorsId] = createSignal(
    props.sensors?.[0].id
  );
  const [selectedScale, setSelectedScale] = createSignal('linear');
  const [scaleType, setScaleType] = createSignal('linear');

  const defaultTimePeriod = 24;

  const [selectedTimePeriod, setSelectedTimePeriod] =
    createSignal(defaultTimePeriod);

  const [dateFrom, setDateFrom] = createSignal(
    dayjs
      .tz(
        Date.now() - calculateTimeDiff(defaultTimePeriod),
        props.timezone
      )
      .toISOString()
  );
  const [dateTo] = createSignal(
    dayjs.tz(Date.now(), props.timezone).toISOString()
  ); // static for now
  const [measurements, setMeasurements] = createSignal([]);

  const [patterns, setPatterns] = createSignal([])

  const [patternPeriod, setPatternPeriod] = createSignal(getYears(props.datetimeFirst.utc, props.datetimeLast.utc)[0])

  function calculateDatetimeFrom() {
    const year = patternPeriod()
    return dayjs(new Date(`${year}-01-01`)).tz(props.timezone).toISOString()
  }

  function calculateDatetimeTo() {
    const year = patternPeriod()
    return dayjs(new Date(`${Number(year) + 1}-01-01`)).tz(props.timezone).toISOString()
  }



  onMount(async () => {
    setMeasurements(
      await getSensorMeasurements(
        selectedSensor(),
        dateFrom(),
        dateTo()
      )
    );
    setLoading(false);
    setPatterns(await getSensorTrends(patternsSensorsId(), 'hourofday', calculateDatetimeFrom(), calculateDatetimeTo()));
    setPatternsLoading(false);
  });

  createEffect(async () => {
    setMeasurements(
      await getSensorMeasurements(sensorsId(), dateFrom(), dateTo())
    );
    setLoading(false);
  });

  createEffect(async () => {
    setPatterns(await getSensorTrends(patternsSensorsId(), 'hourofday', calculateDatetimeFrom(),calculateDatetimeTo()));
    setPatternsLoading(false);
  });

  const onUpdateMeasurementsClick = () => {
    setLoading(true);
    setMeasurements([]);
    setSensorsId(selectedSensor());
    setScaleType(selectedScale());
    setDateFrom(
      dayjs(
        Date.now() - calculateTimeDiff(selectedTimePeriod())
      ).tz(props.timezone).toISOString()
    );
  };

  const [selectedPatternsSensorsId, setSelectedPatternsSensorsId] =
    createSignal(props.sensors?.[0].id);
    const [selectedPatternsPeriod, setSelectedPatternsPeriod] =
    createSignal(getYears(props.datetimeFirst?.utc, props.datetimeLast?.utc)[0]);
  const [patternsLoading, setPatternsLoading] = createSignal(true);
  const [patternsSensorsId, setPatternsSensorsId] = createSignal(
    props.sensors?.[0].id
  );

  const onUpdatePatternsClick = () => {
    setPatternsLoading(true);
    setPatterns([]);
    setPatternsSensorsId(selectedPatternsSensorsId());
    setPatternPeriod(selectedPatternsPeriod());

  };

  return (
    <section class='detail-charts'>
      <div>
        <header class='detail-charts__header'>
        <h1 class="heading">Latest Readings</h1>
        </header>
        
        <div class='chart-container'>
          <div class='chart-controls'>
            <select
              name="sensor-select"
              id="sensor-select"
              class="select"
              onChange={(e) =>
                setSelectedSensor(Number(e.target.value))
              }
            >
              <For each={props.sensors}>
                {(sensor) => (
                  <option value={sensor.id}>
                    {sensor.parameter.displayName}{' '}
                    {sensor.parameter.units}
                  </option>
                )}
              </For>
            </select>
            <select
              name="time-range-select"
              id="time-range-select"
              class="select"
              onChange={(e) =>
                setSelectedTimePeriod(Number(e.target.value))
              }
            >
              <option value="24">Last 24 hours</option>
              <option value="48">Last 48 hours</option>
              <option value="72">Last 72 hours</option>
              <option value="168">Last 1 week</option>
              <option value="720">Last 30 days</option>
            </select>
            <select
              name="scale-type-select"
              id="scale-type-select"
              class="select"
              onChange={(e) => setSelectedScale(e.target.value)}
            >
              <option value="linear" selected>
                Linear
              </option>
              <option value="log">Logarithmic</option>
            </select>
            <button
              class="btn btn-secondary"
              onClick={onUpdateMeasurementsClick}
            >
              Update
            </button>
          </div>
          <div>
            <LineChart
              width={chartWidth()}
              height={250}
              margin={100}
              xTicks={xTicks()}
              dateFrom={dateFrom()}
              dateTo={dateTo()}
              data={measurements()}
              scale={scaleType()}
              loading={loading()}
              timezone={props.timezone}
              noDataMessage={'  No data in selected time range'}
            />
 
            <TimezoneDisclaimer timezone={props.timezone}/>
          </div>
        </div>
      </div>
      <hr class='horizontal-rule' />
      <div>
      <header class='detail-charts__header'>
        <h1 class='heading'>Patterns</h1>
        </header>
        <div class='chart-container'>
          <div class='chart-controls'>
            <select
              name="sensor-select"
              id="sensor-select"
              class="select"
              onChange={(e) =>
                setSelectedPatternsSensorsId(Number(e.target.value))
              }
            >
              <For each={props.sensors}>
                {(sensor) => (
                  <option value={sensor.id}>
                    {sensor.parameter.displayName}{' '}
                    {sensor.parameter.units}
                  </option>
                )}
              </For>
            </select>
            <select
              name="time-range-select"
              id="time-range-select"
              class="select"
              onChange={(e) => setSelectedPatternsPeriod(e.target.value)}
            >
              <For each={getYears(props.datetimeFirst?.utc, props.datetimeLast?.utc)}>{(year,i) => 
                  <option value={year}>{year}</option>              
              }
              </For>
            </select>
            <button
              class="btn btn-secondary"
              onClick={onUpdatePatternsClick}
            >
              Update
            </button>
          </div>
          <div>
          <div>
          <h3 class="type-header-3">Hour of day</h3>
            <Boxplot
                name={'time-of-day'}
                width={350}
                height={350}
                period="hour"
                margin={80}
                data={patterns()}
                loading={patternsLoading()}
            />
            </div>
              <TimezoneDisclaimer timezone={props.timezone}/>
          </div>
        </div>
      </div>
    </section>
  );
}
