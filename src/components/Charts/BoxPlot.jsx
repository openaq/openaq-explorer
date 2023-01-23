import * as d3 from 'd3';
import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useContext } from 'solid-js';
import { createContext } from 'solid-js';

const ChartContext = createContext();

export function ChartProvider(props) {
  const [store, setStore] = createStore({
      values: {
        max: 0,
      },
      style: {
        display: 'none',
        top: 0,
        left: 0,
      },
    }),
    setTooltip = [
      store,
      {
        setTooltip: (props) => {
          setStore({
            period: props.period,
            values: {
              max: props.values?.max,
              interquartileTop: props.values?.interquartileTop,
              median: props.values?.median,
              interquartileBottom: props.values?.interquartileBottom,
              min: props.values?.min,
            },
            style: {
              display: props.style.display,
              y: props.style.y,
              x: props.style.x,
            },
          });
        },
      },
    ];

  return (
    <ChartContext.Provider value={setTooltip}>
      {props.children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  return useContext(ChartContext);
}

export function BoxPlotTooltip(props) {
  const [tooltip] = useChart();

  return (
    <div
      style={`
      position:absolute;
      top:${tooltip.style.y}px;
      left:${tooltip.style.x}px; 
      display:${tooltip.style?.display || 'none'}`}
      className="box-plot-tooltip"
      role="tooltip"
    >
      <div className="box-plot-tooltip__head">
        <span className="type-body3 text-white">
          {tooltip.period}
        </span>
      </div>
      <div className="box-plot-tooltip__body">
        <div className="box-plot-legend-item">
          <div className="bg-smoke-10 box-plot-legend-color"></div>
          <div>
            <span className="type-body-3">{tooltip.values?.max}</span>
            <span className="type-body-1">µg/m³</span>
          </div>
          <div className="box-plot-legend-item-label">
            <span className="type-body-1">
              99<sup>th</sup> percentile
            </span>
          </div>
        </div>
        <div className="box-plot-legend-item">
          <div className="bg-lavender-100 box-plot-legend-color"></div>
          <div>
            <span className="type-body-3">
              {tooltip.values?.interquartileTop}
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
              {tooltip.values?.median}{' '}
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
              {tooltip.values?.interquartileBottom}{' '}
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
              {tooltip.values?.min}{' '}
            </span>
            <span className="type-body-1">µg/m³</span>
          </div>
          <div className="box-plot-legend-item-label">
            <span className="type-body-1">
              1<sup>st</sup> percentile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BoxPlot({
  name,
  width,
  height,
  margin,
  data,
  period,
}) {
  const [tooltip, { setTooltip }] = useChart();
  const [chartData, setChartData] = createSignal(data);
  console.log(chartData());

  const days = ['1', '2', '3', '4', '5', '6', '7'];
  const hours = [
    '01:00',
    '02',
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
  const periods = period == 'day' ? days : hours;
  const boxWidth = width / periods.length - 5;
  const x = d3.scaleBand().range([0, width]).domain(periods);

  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([
      d3.min(data, (d) => d.summary.q02),
      d3.max(data, (d) => Math.ceil(d.summary.q98 / 5) * 5),
    ]);

  const ticksValues =
    periods.length > 12
      ? x.domain().filter((e, i) => i % 3 == 0)
      : periods;

  const yAxis = d3.axisLeft(y).ticks(6);
  const yAxisGrid = d3
    .axisLeft(y)
    .tickSize(-width)
    .tickFormat('')
    .ticks(6);
  const xAxis = d3.axisBottom(x).tickValues(ticksValues);

  createEffect(() => {
    d3.select(`.box-plot-x-axis-${name}`).call(xAxis);
    d3.select(`.box-plot-y-axis-${name}`).call(yAxis);
    d3.select(`.box-plot-grid-${name}`)
      .call(yAxisGrid)
      .selectAll('line,path')
      .style('stroke', '#d4d8dd');
    console.log('effect');
    console.log(data);
    setChartData(data);
  });

  return (
    <>
      <svg
        width={`${width + margin}px`}
        height={`${height + margin}px`}
      >
        <g
          className={`chart-grid box-plot-grid-${name}`}
          transform={`translate(${margin / 2} ${margin / 2} )`}
        ></g>
        <g
          transform={`translate(${margin / 1.8 + boxWidth / 2} ${
            margin / 2
          })`}
        >
          <For each={chartData()}>
            {(d) => {
              return (
                <g
                  onMouseEnter={(e) => {
                    setTooltip({
                      period: d.factor.label,
                      values: {
                        max: d.summary.q98,
                        interquartileTop: d.summary.q75,
                        median: d.summary.median,
                        interquartileBottom: d.summary.q25,
                        min: d.summary.q02,
                      },
                      style: {
                        display: 'block',
                        x: e.clientX - 220,
                        y: e.clientY - 400,
                      },
                    });
                  }}
                  onMouseLeave={(e) =>
                    setTooltip({
                      style: {
                        display: 'none',
                        y: 0,
                        x: 0,
                      },
                    })
                  }
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
          class={`box-plot-y-axis-${name}`}
          transform={`translate(${margin / 2} ${margin / 2})`}
        ></g>
        <g
          class={`box-plot-x-axis-${name}`}
          transform={`translate(${margin / 2} ${
            height + margin / 2
          })`}
        ></g>
      </svg>
    </>
  );
}
