import {
  axisLeft,
  axisBottom,
  scaleBand,
  scaleLinear,
  select,
  max,
  min,
} from 'd3';
import { createEffect, createSignal } from 'solid-js';

function BoxPlotTooltip(props) {
  return (
    <div
      style={`
          position:absolute;
          z-index:4;
          top:${props.data.style?.y}px;
          left:${props.data.style?.x}px; 
          display:${props.data.style?.display || 'none'}`}
      className="box-plot-tooltip"
      role="tooltip"
    >
      <div className="box-plot-tooltip__head">
        <span className="type-body3 text-white">
          {props.data?.period}
        </span>
      </div>
      <div className="box-plot-tooltip__body">
        <div className="box-plot-legend-item">
          <div className="bg-smoke-10 box-plot-legend-color"></div>
          <div>
            <span className="type-body-3">
              {props.data?.values?.max}
            </span>
            <span className="type-body-1">µg/m³</span>
          </div>
          <div className="box-plot-legend-item-label">
            <span className="type-body-1">
              98<sup>th</sup> percentile
            </span>
          </div>
        </div>
        <div className="box-plot-legend-item">
          <div className="bg-lavender-100 box-plot-legend-color"></div>
          <div>
            <span className="type-body-3">
              {props.data.values?.interquartileTop}
            </span>
            <span className="type-body-1">µg/m³</span>
          </div>
          <div className="box-plot-legend-item-label">
            <span className="type-body-1">
              75<sup>th</sup> percentile
            </span>
          </div>
        </div>
        <div className="box-plot-legend-item bg-sky-10">
          <div className="bg-lavender-120 box-plot-legend-color"></div>
          <div>
            <span className="type-body-3">
              {props.data.values?.median}{' '}
            </span>
            <span className="type-body-1">µg/m³</span>
          </div>
          <div className="box-plot-legend-item-label">
            <span className="type-body-1">Median</span>
          </div>
        </div>
        <div className="box-plot-legend-item">
          <div className="bg-lavender-100 box-plot-legend-color"></div>
          <div>
            <span className="type-body-3">
              {props.data.values?.interquartileBottom}{' '}
            </span>
            <span className="type-body-1">µg/m³</span>
          </div>
          <div className="box-plot-legend-item-label">
            <span className="type-body-1">
              25<sup>th</sup> percentile
            </span>
          </div>
        </div>
        <div className="box-plot-legend-item">
          <div className="bg-smoke-10 box-plot-legend-color"></div>
          <div>
            <span className="type-body-3">
              {props.data.values?.min}{' '}
            </span>
            <span className="type-body-1">µg/m³</span>
          </div>
          <div className="box-plot-legend-item-label">
            <span className="type-body-1">
              2<sup>nd</sup> percentile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Boxplot(props) {
  const [tooltip, setTooltip] = createSignal({
    style: {
      display: 'none',
      y: 0,
      x: 0,
    },
  });

  const days = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
  };

  const hoursKeys = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '00',
  ];
  const hoursValues = [
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00',
  ];
  const hours = Object.assign(
    ...hoursKeys.map((k, i) => ({ [k]: hoursValues[i] }))
  );

  const orderHours = (values) =>
    Object.keys(values).sort((a, b) => parseInt(a) - parseInt(b));

  const periods =
    props.period == 'day' ? Object.keys(days) : orderHours(hours);
  const lookup = props.period == 'day' ? days : hours;
  const boxWidth = props.width / periods.length - 5;

  const onMouseEnter = (e, d) => {
    setTooltip({
      period: lookup[d.factor.label],
      values: {
        max: parseFloat(d.summary.q98.toFixed(4)),
        interquartileTop: parseFloat(d.summary.q75.toFixed(4)),
        median: parseFloat(d.summary.median.toFixed(4)),
        interquartileBottom: parseFloat(d.summary.q25.toFixed(4)),
        min: parseFloat(d.summary.q02.toFixed(4)),
      },
      style: {
        display: 'block',
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  const onMouseLeave = () => {
    setTooltip({
      style: {
        display: 'none',
        y: 0,
        x: 0,
      },
    });
  };

  const x = scaleBand().range([0, props.width]).domain(periods);

  const [chartData, setChartData] = createSignal();

  const y = scaleLinear().range([props.height, 0]);

  const yDomain = () => {
    const minimumValue = min(chartData(), (d) => d.summary.q02);
    y.domain([
      minimumValue < 0 ? minimumValue : 0,
      max(chartData(), (d) => Math.ceil(d.summary.q98 / 5) * 5),
    ]);
  };

  const ticksValues =
    periods.length > 12
      ? x
          .domain()
          .filter((e, i) => i % 3 == 0)
          .sort((a, b) => parseInt(b) - parseInt(a))
      : periods;

  const yAxis = axisLeft(y).ticks(6);
  const yAxisGrid = axisLeft(y)
    .tickSize(-props.width)
    .tickFormat('')
    .ticks(6);
  const xAxis = axisBottom(x)
    .tickValues(ticksValues)
    .tickFormat((e, i) => lookup[e]);

  createEffect(() => {
    if (props.data) {
      setChartData(props.data);
      yDomain();
      select(`.box-plot-x-axis-${props.name}`).call(xAxis);
      select(`.box-plot-y-axis-${props.name}`).call(yAxis);
      select(`.box-plot-grid-${props.name}`)
        .call(yAxisGrid)
        .selectAll('line,path')
        .style('stroke', '#d4d8dd');
    }
  });

  return (
    <>
      <div style="position:relative;">
        <BoxPlotTooltip data={tooltip()} />
        <svg
          width={`${props.width + props.margin}px`}
          height={`${props.height + props.margin}px`}
        >
          <g
            className={`chart-grid box-plot-grid-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            } )`}
          ></g>
          <g
            transform={`translate(${
              props.margin / 1.8 + boxWidth / 2
            } ${props.margin / 2})`}
          >
            <For each={chartData()}>
              {(d) => {
                return (
                  <g
                    onMouseEnter={(e) => onMouseEnter(e, d)}
                    onMouseLeave={onMouseLeave}
                  >
                    <line
                      stroke-width={2}
                      stroke="#CCCCCC"
                      className="whiskers"
                      x1={x(d.factor.label)}
                      x2={x(d.factor.label)}
                      y1={y(d.summary.q02)}
                      y2={y(d.summary.q98)}
                    />
                    <line
                      stroke-width={boxWidth}
                      stroke="#EAE7FF"
                      className="box"
                      x1={x(d.factor.label)}
                      x2={x(d.factor.label)}
                      y1={y(d.summary.q25)}
                      y2={y(d.summary.q75)}
                    />
                    <line
                      stroke-width={2}
                      stroke="#8576ED"
                      className="q3"
                      x1={x(d.factor.label) - boxWidth / 2}
                      x2={x(d.factor.label) + boxWidth / 2}
                      y1={y(d.summary.q75)}
                      y2={y(d.summary.q75)}
                    />
                    <line
                      stroke-width={2}
                      stroke="#8576ED"
                      className="q1"
                      x1={x(d.factor.label) - boxWidth / 2}
                      x2={x(d.factor.label) + boxWidth / 2}
                      y1={y(d.summary.q25)}
                      y2={y(d.summary.q25)}
                    />
                    <line
                      stroke-width={4}
                      stroke="#584DAE"
                      className="median"
                      x1={x(d.factor.label) - boxWidth / 2}
                      x2={x(d.factor.label) + boxWidth / 2}
                      y1={y(d.summary.median)}
                      y2={y(d.summary.median)}
                    />
                  </g>
                );
              }}
            </For>
          </g>
          <g
            class={`box-plot-y-axis-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          ></g>
          <g
            class={`box-plot-x-axis-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.height + props.margin / 2
            })`}
          ></g>
        </svg>
      </div>
    </>
  );
}
