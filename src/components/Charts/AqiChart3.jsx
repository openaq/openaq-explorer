import * as d3 from 'd3';
import { createEffect, createSignal } from 'solid-js';

function aqiValue(value) {
  if (value < 50) {
    return 'green';
  }
  if (value < 100) {
    return 'yellow';
  }
  if (value < 150) {
    return 'orange';
  }
  if (value < 200) {
    return 'red';
  }
  if (value < 300) {
    return 'purple';
  } else {
    return 'maroon';
  }
}
export default function AqiChart3(props) {
  const x = d3.scaleTime().range([0, props.width]);
  x.domain(d3.extent(props.data, (d) => new Date(d.date.local)));
  const xAxis = d3.axisBottom(x);

  const y = d3.scaleLinear().range([props.height, 0]);
  const yAxis = d3.axisLeft(y).ticks(5);
  const yAxisGrid = d3
    .axisLeft(y)
    .tickSize(-props.width)
    .tickFormat('')
    .ticks(5);

  y.domain([0, 500]);

  const bars = props.data.map((o) => {
    const val = o.value + 1;
    return {
      value: o.value,
      x: x(new Date(o.date.local)),
      y: y(val * 20),
      height: y(0) - y(val * 20),
      width: 40,
      color: aqiValue(val * 20),
    };
  });

  createEffect(() => {
    d3.select(`.aqi-plot-x-axis-${props.name}`).call(xAxis);
    d3.select(`.aqi-plot-y-axis-${props.name}`).call(yAxis);
    d3.select(`.aqi-chart-grid-${props.name}`)
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
          <defs>
            <linearGradient id="green" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#00e400" />
              <stop offset="20%" stop-color="#00e400" />
              <stop offset="100%" stop-color="#72ff72" />
            </linearGradient>
            <linearGradient id="yellow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#ffff00" />
              <stop offset="10%" stop-color="#ffff00" />
              <stop offset="100%" stop-color="#ffff80" />
            </linearGradient>
            <linearGradient id="orange" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#ff7e00" />
              <stop offset="20%" stop-color="#ff7e00" />
              <stop offset="100%" stop-color="#ffbf80" />
            </linearGradient>
            <linearGradient id="red" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#ff0000" />
              <stop offset="25%" stop-color="#ff0000" />
              <stop offset="100%" stop-color="#ff8080" />
            </linearGradient>
            <linearGradient id="purple" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#8f3f97" />
              <stop offset="30%" stop-color="#8f3f97" />
              <stop offset="100%" stop-color="#ce97d3" />
            </linearGradient>
            <linearGradient id="maroon" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#7e0023" />
              <stop offset="40%" stop-color="#7e0023" />
              <stop offset="100%" stop-color="#ff3f74" />
            </linearGradient>
          </defs>
          <g
            class={`chart-grid aqi-chart-grid-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          ></g>
          <g
            transform={`translate(${props.margin} ${
              props.margin / 2
            })`}
          >
            <For each={bars}>
              {(item) => (
                <rect
                  x={item.x - 0.5}
                  y={item.y - 0.5}
                  height={item.height + 0.5}
                  fill={'#ce9217'}
                  width={item.width + 1}
                />
              )}
            </For>
            <For each={bars}>
              {(item) => (
                <rect
                  x={item.x}
                  y={item.y}
                  height={item.height}
                  fill={`url(#${item.color})`}
                  width={item.width}
                />
              )}
            </For>
          </g>
          <g
            class="y-axis"
            transform={`translate(${props.margin / 2} 0)`}
          ></g>
          <g
            class="x-axis"
            transform={`translate(0 ${
              props.height + props.margin / 2
            })`}
          ></g>
          <g
            class={`aqi-plot-y-axis-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          ></g>
          <g
            class={`aqi-plot-x-axis-${props.name}`}
            transform={`translate(${props.margin / 2} ${
              props.height + props.margin / 2
            })`}
          ></g>
        </svg>
      </div>
    </>
  );
}
