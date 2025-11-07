import {
  axisLeft,
  axisBottom,
  scaleBand,
  scaleLinear,
  select,
  max,
  min,
} from 'd3';
import { createEffect, createSignal, For, Show } from 'solid-js';

import '~/assets/scss/components/box-plot.scss';

function BoxPlotTooltip(props) {
  return (
    <div
      style={{
        top: `${props.data.style?.y}px`,
        left: `${props.data.style?.x}px`,
        display: `${props.data.style?.display || 'none'}`,
      }}
      class="box-plot-tooltip"
      role="tooltip"
    >
      <div class="box-plot-tooltip__head">
        <span class="type-body3 text-white">{props.data?.period}</span>
      </div>
      <div class="box-plot-tooltip__body">
        <div class="box-plot-legend-item">
          <div class="bg-smoke-10 box-plot-legend-color" />
          <div>
            <span class="type-body-3">{props.data?.values?.max}</span>
            <span class="type-body-1">µg/m³</span>
          </div>
          <div class="box-plot-legend-item-label">
            <span class="type-body-1">
              98<sup>th</sup> percentile
            </span>
          </div>
        </div>
        <div class="box-plot-legend-item">
          <div class="bg-lavender-100 box-plot-legend-color" />
          <div>
            <span class="type-body-3">
              {props.data.values?.interquartileTop}
            </span>
            <span class="type-body-1">µg/m³</span>
          </div>
          <div class="box-plot-legend-item-label">
            <span class="type-body-1">
              75<sup>th</sup> percentile
            </span>
          </div>
        </div>
        <div class="box-plot-legend-item bg-sky-1">
          <div class="bg-lavender-120 box-plot-legend-color" />
          <div>
            <span class="type-body-3">{props.data.values?.median} </span>
            <span class="type-body-1">µg/m³</span>
          </div>
          <div class="box-plot-legend-item-label">
            <span class="type-body-1">Median</span>
          </div>
        </div>
        <div class="box-plot-legend-item">
          <div class="bg-lavender-100 box-plot-legend-color" />
          <div>
            <span class="type-body-3">
              {props.data.values?.interquartileBottom}{' '}
            </span>
            <span class="type-body-1">µg/m³</span>
          </div>
          <div class="box-plot-legend-item-label">
            <span class="type-body-1">
              25<sup>th</sup> percentile
            </span>
          </div>
        </div>
        <div class="box-plot-legend-item">
          <div class="bg-smoke-10 box-plot-legend-color" />
          <div>
            <span class="type-body-3">{props.data.values?.min} </span>
            <span class="type-body-1">µg/m³</span>
          </div>
          <div class="box-plot-legend-item-label">
            <span class="type-body-1">
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

  const [data, setData] = createSignal([]);

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

  const periods = orderHours(hours);
  const lookup = hours;
  const boxWidth = props.width / periods.length - 5;

  const onMouseEnter = (e, d) => {
    setTooltip({
      period: lookup[d.period.label],
      values: {
        max: parseFloat(d.summary.q98.toFixed(3)),
        interquartileTop: parseFloat(d.summary.q75.toFixed(3)),
        median: parseFloat(d.summary.median.toFixed(3)),
        interquartileBottom: parseFloat(d.summary.q25.toFixed(3)),
        min: parseFloat(d.summary.q02.toFixed(3)),
      },
      style: {
        display: 'block',
        x: e.pageX + 20,
        y: e.pageY - 250,
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
  const y = scaleLinear().range([props.height, 0]);

  const yDomain = () => {
    const minimumValue =
      props.data == undefined ? 0 : min(props.data, (d) => d.summary.q02);
    y.domain([
      minimumValue < 0 ? minimumValue : 0,
      props.data == undefined ? 0 : max(props.data, (d) => d.summary.q98 * 1.1),
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
  const yAxisGrid = axisLeft(y).tickSize(-props.width).tickFormat('').ticks(6);
  const xAxis = axisBottom(x)
    .tickValues(ticksValues)
    .tickFormat((e) => lookup[e]);

  createEffect(() => {
    if (props.data) {
      setData(props.data);
      yDomain();
      select(`.box-plot-x-axis-${props.name}`).call(xAxis);
      select(`.box-plot-y-axis-${props.name}`).call(yAxis);
      select(`.box-plot-grid-${props.name}`)
        .call(yAxisGrid)
        .selectAll('line,path')
        .style('stroke', '#d4d8dd');
    }

    if (!toggleTable()) {
      setData(props.data);
      yDomain();
      select(`.box-plot-x-axis-${props.name}`).call(xAxis);
      select(`.box-plot-y-axis-${props.name}`).call(yAxis);
      select(`.box-plot-grid-${props.name}`)
        .call(yAxisGrid)
        .selectAll('line,path')
        .style('stroke', '#d4d8dd');
    }
  });

  const tableData = (data) => 
    data.map((t) => {
      return {
        period: lookup[t.period.label],
        values: {
          max: parseFloat(t.summary.q98.toFixed(3)),
          interquartileTop: parseFloat(t.summary.q75.toFixed(3)),
          median: parseFloat(t.summary.median.toFixed(3)),
          interquartileBottom: parseFloat(t.summary.q25.toFixed(3)),
          min: parseFloat(t.summary.q02.toFixed(3)),
        }
      };
    }
  );

  const [toggleTable, setToggleTable] = createSignal(false);

  const toggleTableData = () => {
    setToggleTable(!toggleTable());
  }

  return (
    <>
      <button 
        class="btn btn-tertiary toggle-table-box"
        onClick={toggleTableData}
      >
        <Show 
          when={toggleTable()}
          fallback={"View data as table"}
        >
          View data as chart
        </Show>
      </button>
      <BoxPlotTooltip data={tooltip()} />
      <Show when={!toggleTable()}>
        <svg
          width={`${props.width + props.margin}px`}
          height={`${props.height + props.margin}px`}
          role="img"
          aria-label="box plot chart"
        >
          <g
            class={`chart-grid box-plot-grid-${props.name}`}
            transform={`translate(${props.margin / 2} ${props.margin / 2} )`}
          />
          <g
            transform={`translate(${
              props.margin / 1.8 + boxWidth / 2
            } ${props.margin / 2})`}
          >
            <Show when={props.loading}>
              <text text-anchor="middle" x={props.width / 2} y={props.height / 2}>
                Loading...
              </text>
            </Show>
            <For each={data()}>
              {(d) => {
                return (
                  <g
                    class="box-plot-bar"
                    onMouseEnter={(e) => onMouseEnter(e, d)}
                    onMouseLeave={onMouseLeave}
                  >
                    <line
                      stroke-width={2}
                      stroke="#CCCCCC"
                      class="whiskers"
                      x1={x(d.period.label)}
                      x2={x(d.period.label)}
                      y1={y(d.summary.q02)}
                      y2={y(d.summary.q98)}
                    />
                    <line
                      stroke-width={boxWidth}
                      stroke="#EAE7FF"
                      class="box"
                      x1={x(d.period.label)}
                      x2={x(d.period.label)}
                      y1={y(d.summary.q25)}
                      y2={y(d.summary.q75)}
                    />
                    <line
                      stroke-width={2}
                      stroke="#8576ED"
                      class="q3"
                      x1={x(d.period.label) - boxWidth / 2}
                      x2={x(d.period.label) + boxWidth / 2}
                      y1={y(d.summary.q75)}
                      y2={y(d.summary.q75)}
                    />
                    <line
                      stroke-width={2}
                      stroke="#8576ED"
                      class="q1"
                      x1={x(d.period.label) - boxWidth / 2}
                      x2={x(d.period.label) + boxWidth / 2}
                      y1={y(d.summary.q25)}
                      y2={y(d.summary.q25)}
                    />
                    <line
                      stroke-width={4}
                      stroke="#584DAE"
                      class="median"
                      x1={x(d.period.label) - boxWidth / 2}
                      x2={x(d.period.label) + boxWidth / 2}
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
            transform={`translate(${props.margin / 2} ${props.margin / 2})`}
          />
          <g
            class={`box-plot-x-axis-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.height + props.margin / 2
            })`}
          />
        </svg>
      </Show>
      <Show when={toggleTable()}>
        <table class="table-data-box">
          <thead style={{ position: 'sticky', top: '-1px'}}>
            <tr>
              <th>Time</th>
              <th>98<sup>th</sup> percentile</th>
              <th>75<sup>th</sup> percentile</th>
              <th>Median</th>
              <th>25<sup>th</sup> percentile</th>
              <th>2<sup>nd</sup> percentile</th>
            </tr>
          </thead>
          <tbody>
            <For each={tableData(props.data)}>
              {(item) => (
                <tr>
                  <td>{item.period}</td>
                  <td>{item.values.max} µg/m³</td>
                  <td>{item.values.interquartileTop} µg/m³</td>
                  <td>{item.values.median} µg/m³</td>
                  <td>{item.values.interquartileBottom} µg/m³</td>
                  <td>{item.values.min} µg/m³</td>
                </tr>
              )}
            </For>
            <Show when={props.loading}>
              <tr>
                <td colspan="6">Loading...</td>
              </tr>
            </Show>
          </tbody>
        </table>
      </Show>
    </>
  );
}
