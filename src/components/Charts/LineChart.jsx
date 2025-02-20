import {
  area as d3Area,
  line as d3Line,
  scaleTime,
  scaleLinear,
  axisBottom,
  axisLeft,
  select,
  min,
  max,
  extent,
  timeFormat,
  timeSecond,
  timeMinute,
  timeHour,
  timeDay,
  timeWeek,
  timeMonth,
  timeYear,
  scaleSymlog,
} from 'd3';

import { createSignal, Show, For, createEffect } from 'solid-js';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import '~/assets/scss/components/line-chart.scss';

dayjs.extend(utc);
dayjs.extend(tz);

const formatMillisecond = timeFormat('.%L');
const formatSecond = timeFormat(':%S');
const formatMinute = timeFormat('%H:%M');
const formatHour = timeFormat('%H:%M');
const formatDay = timeFormat('%b %d');
const formatWeek = timeFormat('%b %d');
const formatMonth = timeFormat('%B');
const formatYear = timeFormat('%Y');

export function multiFormat(date, timezone) {
  return (
    timeSecond(date) < date
      ? formatMillisecond
      : timeMinute(date) < date
        ? formatSecond
        : timeHour(date) < date
          ? formatMinute
          : timeDay(date) < date
            ? formatHour
            : timeMonth(date) < date
              ? timeWeek(date) < date
                ? formatDay
                : formatWeek
              : timeYear(date) < date
                ? formatMonth
                : formatYear
  )(
    new Date(
      date.toLocaleString('en-US', {
        timeZone: timezone,
      })
    )
  );
}

// splits single measurements series into multiple subseries
// if dates are not continuous
export function splitMeasurements(measurements, timezone) {
  let result = [];
  let lastDate;
  if (!measurements || measurements.length === 0) {
    return [[]];
  }
  measurements
    .filter((o) => o.value !== null)
    .reduce((acc, curr, idx, arr) => {
      const date = dayjs(curr.period.datetimeTo.local, timezone);
      if (
        !(lastDate === undefined || (date - lastDate) / (60 * 60 * 1000) === 1)
      ) {
        result.push(acc);
        acc = [];
      }
      acc.push(curr);
      if (idx === arr.length - 1 && acc.length > 0) {
        result.push(acc);
      }
      lastDate = date;
      return acc;
    }, []);
  return result;
}

export default function LineChart(props) {
  const [tooltipValue, setTooltipValue] = createSignal({});

  const xScale = (width, dateFrom, dateTo) => {
    const x = scaleTime().range([0, width]);
    x.domain(
      extent([dayjs(dateFrom, props.timezone), dayjs(dateTo, props.timezone)])
    );
    return x;
  };

  const yScale = (scaleType, height, data) => {
    let y;
    if (scaleType == 'linear') {
      y = scaleLinear().range([height, 0]);
    } else {
      y = scaleSymlog().range([height, 0]);
    }

    const minimumValue = data == undefined ? 0 : min(data, (d) => d.value);
    const domainMin = minimumValue < 0 ? minimumValue : 0;
    const domainMax =
      data == undefined ? 0 : max(data, () => max(data, (d) => d.value)) * 1.2;
    y.domain([domainMin, domainMax]);
    return y;
  };

  const yAxis = (y) => axisLeft(y).ticks(5);
  const yAxisGrid = (y, width) =>
    axisLeft(y).tickSize(-width).tickFormat('').ticks(5);

  const xAxis = (x) =>
    axisBottom(x)
      .ticks(props.xTicks)
      .tickFormat((d) => multiFormat(d, props.timezone));

  const points = (data, x, y) =>
    data.map((o) => {
      return {
        value: o.value,
        cx: x(dayjs(o.period.datetimeTo.local, props.timezone)),
        cy: y(o.value),
        unit: o.parameter.units,
        date: dayjs(o.period.datetimeTo.local, props.timezone),
      };
    });

  const line = (x, y) =>
    d3Line()
      .x((d) => x(dayjs(d.period.datetimeTo.local, props.timezone)))
      .y((d) => y(d.value));

  const area = (x, y) =>
    d3Area()
      .x((d) => x(dayjs(d.period.datetimeTo.local, props.timezone)))
      .y0(props.height)
      .y1((d) => y(d.value));

  let yAxisRef;
  let xAxisRef;
  let gridRef;

  function update() {
    if (props.data) {
      const x = xScale(props.width, props.dateFrom, props.dateTo);
      const y = yScale(props.scale, props.height, props.data);
      const f = yAxisGrid(y, props.width);
      select(xAxisRef).call(xAxis(x));
      select(yAxisRef).call(yAxis(y));
      select(gridRef).call(f);
    }
  }

  createEffect(() => update());

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div
          class="line-chart-tooltip"
          style={{
            display: tooltipValue()?.visible ? 'flex' : 'none',
            left: `${tooltipValue()?.x - 65}px`,
            top: `${tooltipValue()?.y + 5}px`,
          }}
        >
          <span class="line-chart-tooltip__value">{tooltipValue()?.value}</span>{' '}
          <span class="line-chart-tooltip__unit">{tooltipValue()?.unit}</span>
        </div>
        <svg
          width={`${props.width + props.margin}px`}
          height={`${props.height + props.margin}px`}
        >
          <defs>
            <linearGradient
              id="area-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stop-color="#d4cdf9" stop-opacity="0.7" />
              <stop offset="95%" stop-color="white" stop-opacity="0.7" />
            </linearGradient>
          </defs>
          <filter id="shadow" color-interpolation-filters="sRGB">
            <feDropShadow
              dx="2"
              dy="2"
              stdDeviation="0.5"
              flood-opacity="0.2"
            />
          </filter>

          <g transform={`translate(${props.margin / 2} ${props.margin / 2})`}>
            <For each={splitMeasurements(props.data, props.timezone)}>
              {(d) => (
                <path
                  class="line-chart-area"
                  d={area(
                    xScale(props.width, props.dateFrom, props.dateTo),
                    yScale(props.scale, props.height, props.data)
                  )(d)}
                />
              )}
            </For>
          </g>
          <g
            class="grid"
            transform={`translate(${props.margin / 2} ${props.margin / 2} )`}
            ref={gridRef}
          />
          <g transform={`translate(${props.margin / 2} ${props.margin / 2})`}>
            <For each={splitMeasurements(props.data, props.timezone)}>
              {(lineData) => (
                <path
                  class="line-chart-line"
                  d={line(
                    xScale(props.width, props.dateFrom, props.dateTo),
                    yScale(props.scale, props.height, props.data)
                  )(lineData)}
                />
              )}
            </For>
            <Show when={tooltipValue()?.visible}>
              <line
                x1={tooltipValue()?.x}
                y1={props.height}
                x2={tooltipValue()?.x}
                y2={tooltipValue()?.y}
                stroke="#6A5CD8"
                stroke-width={1}
              />
              <circle
                class="line-chart-point-highlight"
                cx={tooltipValue()?.x}
                cy={tooltipValue()?.y}
                r={9}
              />
              <rect
                x="0"
                y="0"
                rx="5"
                ry="5"
                width="40"
                height="25"
                fill="#6A5CD8"
                transform={`translate(${tooltipValue()?.x - 20},${
                  props.height
                })`}
              />
            </Show>
            <For
              each={points(
                props.data.filter((o) => o.value !== null) ?? [],
                xScale(props.width, props.dateFrom, props.dateTo),
                yScale(props.scale, props.height, props.data)
              )}
            >
              {(item) => (
                <circle
                  class="line-chart-point"
                  cx={item.cx}
                  cy={item.cy}
                  r={item.cx == tooltipValue()?.x ? 5 : 3}
                  onMouseEnter={() => {
                    setTooltipValue({
                      visible: true,
                      x: item.cx,
                      y: item.cy,
                      value: item.value,
                      unit: item.unit,
                      date: item.date,
                    });
                  }}
                  onMouseLeave={() => setTooltipValue({ visible: false })}
                />
              )}
            </For>
            <Show when={props.loading}>
              <text
                text-anchor="middle"
                x={props.width / 2}
                y={props.height / 2}
              >
                Loading...
              </text>
            </Show>
            <Show
              when={
                props.data == undefined ||
                (props.data.length === 0 && props.loading === false)
              }
            >
              <text
                text-anchor="middle"
                x={props.width / 2}
                y={props.height / 2}
              >
                {props.noDataMessage}
              </text>
            </Show>
          </g>
          <g
            class="y-axis"
            transform={`translate(${props.margin / 2} ${props.margin / 2})`}
            ref={yAxisRef}
          />
          <g
            class="x-axis"
            transform={`translate(${props.margin / 2} ${
              props.height + props.margin / 2
            })`}
            ref={xAxisRef}
          />
          <g transform={`translate(${props.margin / 2} ${props.margin / 2})`}>
            <Show when={tooltipValue()?.visible}>
              <text
                x="0"
                y="0"
                font-size="12"
                fill="white"
                transform={`translate(${tooltipValue()?.x - 16},${
                  props.height + 17
                })`}
              >
                {tooltipValue()?.date.tz(props.timezone).format('HH:mm')}
              </text>
            </Show>
          </g>
        </svg>
      </div>
    </>
  );
}
