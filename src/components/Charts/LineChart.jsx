import * as d3 from 'd3';
import { createEffect, createSignal } from 'solid-js';

export default function LineChart(props) {
  const [tooltipValue, setTooltipValue] = createSignal();

  const x = d3.scaleTime().range([0, props.width]);
  x.domain(d3.extent(props.data, (d) => new Date(d.date.local)));

  const y = d3.scaleLinear().range([props.height, 0]);

  const yAxis = d3.axisLeft(y).ticks(5);
  const yAxisGrid = d3
    .axisLeft(y)
    .tickSize(-props.width)
    .tickFormat('')
    .ticks(5);

  y.domain([
    d3.min(props.data, (d) => d.value),
    Math.ceil(
      d3.max(
        props.data,
        (d) => d.value + d3.max(props.data, (d) => d.value) / 5
      ) / 5
    ) * 5,
  ]);

  const points = props.data.map((o) => {
    return {
      value: o.value,
      cx: x(new Date(o.date.local)),
      cy: y(o.value),
      unit: o.unit,
    };
  });
  const line = d3
    .line()
    .x((d) => x(new Date(d.date.local)))
    .y((d) => y(d.value));

  const area = d3
    .area()
    .x((d) => x(new Date(d.date.local)))
    .y0(props.height)
    .y1((d) => y(d.value));

  createEffect(() => {
    d3.select('.x-axis').call(d3.axisBottom(x));
    d3.select('.y-axis').call(yAxis);
    d3.select('.line-chart-grid')
      .call(yAxisGrid)
      .selectAll('line,path')
      .style('stroke', '#d4d8dd');
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
          }left:${tooltipValue()?.x - 90}px; top:${
            tooltipValue()?.y - 25
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
              dx="10"
              dy="10"
              stdDeviation="3"
              flood-opacity="0.5"
            />
          </filter>
          <g
            className="line-chart-grid"
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            } )`}
          ></g>
          <g
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          >
            <path className="line-chart-area" d={area(props.data)} />
            <path className="line-chart-line" d={line(props.data)} />
            <For each={points}>
              {(item) => (
                <circle
                  className="line-chart-point"
                  cx={item.cx}
                  cy={item.cy}
                  r={3}
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
