import * as d3 from 'd3';
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
} from 'd3';
import { createSignal, createEffect, Show } from 'solid-js';
import { useStore } from '../../stores';

const formatMillisecond = timeFormat('.%L');
const formatSecond = timeFormat(':%S');
const formatMinute = timeFormat('%I:%M');
const formatHour = timeFormat('%I:%M');
const formatDay = timeFormat('%b %d');
const formatWeek = timeFormat('%b %d');
const formatMonth = timeFormat('%B');
const formatYear = timeFormat('%Y');

const multiFormat = (date) =>
  (timeSecond(date) < date
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
    : formatYear)(date);

// splits single measurements series into multiple subseries
// if dates are not continuous
function splitMeasurements(measurements) {
  let result = [];
  let lastDate;
  if (measurements.length === 0) {
    return [[]];
  }
  measurements.reduce((acc, curr, idx, arr) => {
    const date = new Date(curr.period.datetimeTo.local);
    if (
      !(
        lastDate === undefined ||
        parseInt((date - lastDate) / (60 * 60 * 1000)) === 1
      )
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
  const [tooltipValue, setTooltipValue] = createSignal();
  const [chartData, setChartData] = createSignal(props.data);
  const [store] = useStore();

  const x = scaleTime().range([0, props.width]);
  const y = scaleLinear().range([props.height, 0]);

  const yAxis = axisLeft(y).ticks(5);
  const yAxisGrid = axisLeft(y)
    .tickSize(-props.width)
    .tickFormat('')
    .ticks(5);

  const xAxis = axisBottom(x)
    .ticks(24)
    .tickFormat((d) => multiFormat(d));

  const points = (data) =>
    data.map((o) => {
      return {
        value: o.value,
        cx: x(new Date(o.period.datetimeTo.local)),
        cy: y(o.value),
        unit: o.parameter.units,
      };
    });

  const line = d3Line()
    .x((d) => x(new Date(d.period.datetimeTo.local)))
    .y((d) => y(d.value));

  const area = d3Area()
    .x((d) => x(new Date(d.period.datetimeTo.local)))
    .y0(props.height)
    .y1((d) => y(d.value));

  const yDomain = () => {
    const minimumValue = min(props.data, (d) => d.value);

    y.domain([
      minimumValue < 0 ? minimumValue : 0,
      max(props.data, (d) => max(props.data, (d) => d.value) * 1.2),
    ]);
  };

  const xDomain = () => {
    x.domain(
      extent([new Date(props.dateFrom), new Date(props.dateTo)])
    );
  };

  yDomain();
  xDomain();
  createEffect(() => {
    if (props.data) {
      setChartData(props.data);
      xDomain();
      yDomain();
      select('.x-axis').call(xAxis);

      select('.y-axis').call(yAxis);
      select('.line-chart-grid')
        .call(yAxisGrid)
        .selectAll('line,path')
        .style('stroke', '#d4d8dd');
    }
  });

  return (
    <>
      <div style="position:relative;">
        <div
          className="line-chart-tooltip"
          style={`${
            tooltipValue()?.visible
              ? 'display:flex;'
              : 'display:none;'
          }left:${tooltipValue()?.x - 65}px; top:${
            tooltipValue()?.y + 5
          }px;`}
        >
          <span className="line-chart-tooltip__value">
            {tooltipValue()?.value}
          </span>{' '}
          <span className="line-chart-tooltip__unit">
            {tooltipValue()?.unit}
          </span>
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
              <stop
                offset="0%"
                stop-color="#d4cdf9"
                stop-opacity="0.7"
              />
              <stop
                offset="95%"
                stop-color="white"
                stop-opacity="0.7"
              />
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

          <g
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          >
            <For each={splitMeasurements(chartData())}>
              {(areaData) => (
                <path
                  className="line-chart-area"
                  d={area(areaData)}
                />
              )}
            </For>
          </g>
          <g
            className="chart-grid line-chart-grid"
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            } )`}
          ></g>
          <g
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          >
            <For each={splitMeasurements(chartData())}>
              {(lineData) => (
                <path
                  className="line-chart-line"
                  d={line(lineData)}
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
              />
              <circle
                className="line-chart-point-highlight"
                cx={tooltipValue()?.x}
                cy={tooltipValue()?.y}
                r={9}
              />
            </Show>
            <For each={points(chartData())}>
              {(item) => (
                <circle
                  className="line-chart-point"
                  cx={item.cx}
                  cy={item.cy}
                  r={item.cx == tooltipValue()?.x ? 5 : 3}
                  onMouseEnter={(e) =>
                    setTooltipValue({
                      visible: true,
                      x: item.cx,
                      y: item.cy,
                      value: item.value,
                      unit: item.unit,
                    })
                  }
                  onMouseLeave={(e) =>
                    setTooltipValue({ visible: false })
                  }
                />
              )}
            </For>
            <Show when={store.measurements.loading}>
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
                store.measurements.state == 'ready' &&
                props.data.length === 0
              }
            >
              <text
                text-anchor="middle"
                x={props.width / 2}
                y={props.height / 2}
              >
                No data in selected time range
              </text>
            </Show>
          </g>
          <g
            class="y-axis"
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          ></g>
          <g
            class="x-axis"
            transform={`translate(${props.margin / 2} ${
              props.height + props.margin / 2
            })`}
          ></g>
        </svg>
      </div>
    </>
  );
}
