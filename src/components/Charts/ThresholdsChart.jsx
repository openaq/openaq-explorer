import * as d3 from 'd3';

import { For } from 'solid-js';
import { createEffect } from 'solid-js';

export default function ThresholdsChart(props) {
  const periods = props.data.map((o) => o.period);

  const x = d3.scaleBand().range([0, props.width]).domain(periods);
  const xAxis = d3.axisBottom(x);

  const y = d3.scaleLinear().range([props.height, 0]);
  const yAxis = d3.axisLeft(y).ticks(5);
  const yAxisGrid = d3
    .axisLeft(y)
    .tickSize(-props.width)
    .tickFormat('')
    .ticks(5);

  y.domain([0, 100]);

  const bars = props.data.map((o) => {
    return {
      value: o.value,
      x: x(o.period),
      y: y(o.value),
      height: y(0) - y(o.value),
      width: 40,
      color: '#B3AAF0',
    };
  });

  createEffect(() => {
    d3.select(`.thresholds-plot-x-axis-${props.name}`).call(xAxis);
    d3.select(`.thresholds-plot-y-axis-${props.name}`).call(yAxis);
    d3.select(`.thresholds-chart-grid-${props.name}`)
      .call(yAxisGrid)
      .selectAll('line,path')
      .style('stroke', '#d4d8dd');
  });

  return (
    <>
      <div>
        <svg
          width={`${props.width + props.margin}px`}
          height={`${props.height + props.margin}px`}
        >
          <g
            class={`chart-grid thresholds-chart-grid-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          />
          <g
            transform={`translate(${props.margin} ${
              props.margin / 2
            })`}
          >
            <For each={bars}>
              {(item) => (
                <rect
                  x={item.x}
                  y={item.y}
                  height={item.height}
                  fill={'#6A5CD8'}
                  width={item.width}
                />
              )}
            </For>
          </g>
          <g
            class="y-axis"
            transform={`translate(${props.margin / 2} 0)`}
          />
          <g
            class="x-axis"
            transform={`translate(0 ${
              props.height + props.margin / 2
            })`}
          />
          <g
            class={`thresholds-plot-y-axis-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          />
          <g
            class={`thresholds-plot-x-axis-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.height + props.margin / 2
            })`}
          />
        </svg>
      </div>
    </>
  );
}
