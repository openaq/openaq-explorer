import * as d3 from 'd3';
import { createEffect } from 'solid-js';

export default function BoxPlot({
  name,
  width,
  height,
  margin,
  data,
  styles = {
    whiskerStrokeWidth: 4,
    whiskerStroke: '#ccc',
  },
}) {
  const boxWidth = width / data.periods.length - 10;
  const x = d3.scaleBand().range([0, width]).domain(data.periods);

  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([
      d3.min(data.summaries, (d) => d.min),
      d3.max(data.summaries, (d) => d.max),
    ]);

  const yAxis = d3.axisLeft(y).ticks(5);
  const yAxisGrid = d3
    .axisLeft(y)
    .tickSize(-width)
    .tickFormat('')
    .ticks(5);

  createEffect(() => {
    d3.select(`.box-plot-x-axis-${name}`).call(d3.axisBottom(x));
    d3.select(`.box-plot-y-axis-${name}`).call(yAxis);
    d3.select(`line-chart-grid-${name}`)
      .call(yAxisGrid)
      .selectAll('line,path')
      .style('stroke', '#d4d8dd');
  });

  return (
    <>
      <svg
        width={`${width + margin}px`}
        height={`${height + margin}px`}
      >
        <g
          className={`line-chart-grid line-chart-grid-${name}`}
          transform={`translate(${margin / 2} ${margin / 2} )`}
        ></g>
        <g transform={`translate(${margin + 4} ${margin / 2})`}>
          <For each={data.summaries}>
            {(d) => {
              return (
                <>
                  <line
                    stroke-width={4}
                    stroke="#CCCCCC"
                    className="whiskers"
                    x1={x(d.period)}
                    x2={x(d.period)}
                    y1={y(d.min)}
                    y2={y(d.max)}
                  />
                  <line
                    stroke-width={boxWidth}
                    stroke="#EAE7FF"
                    className="box"
                    x1={x(d.period)}
                    x2={x(d.period)}
                    y1={y(d.q1)}
                    y2={y(d.q3)}
                  />
                  <line
                    stroke-width={2}
                    stroke="#8576ED"
                    className="q3"
                    x1={x(d.period) - boxWidth / 2}
                    x2={x(d.period) + boxWidth / 2}
                    y1={y(d.q3)}
                    y2={y(d.q3)}
                  />
                  <line
                    stroke-width={2}
                    stroke="#8576ED"
                    className="q1"
                    x1={x(d.period) - boxWidth / 2}
                    x2={x(d.period) + boxWidth / 2}
                    y1={y(d.q1)}
                    y2={y(d.q1)}
                  />
                  <line
                    stroke-width={4}
                    stroke="#584DAE"
                    className="median"
                    x1={x(d.period) - boxWidth / 2}
                    x2={x(d.period) + boxWidth / 2}
                    y1={y(d.median)}
                    y2={y(d.median)}
                  />
                </>
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
