import * as d3 from 'd3';
import { createEffect, createSignal } from 'solid-js';

function aqiValue(value) {
  if (value < 50) {
    return 'good';
  }
  if (value < 100) {
    return 'moderate';
  }
  if (value < 150) {
    return 'sensitive';
  }
  if (value < 200) {
    return 'unhealthy';
  }
  if (value < 300) {
    return 'very-unhealthy';
  } else {
    return 'hazardous';
  }
}

export default function AqiChart2(props) {
  const [tooltipValue, setTooltipValue] = createSignal();

  const x = d3.scaleTime().range([0, props.width]);
  x.domain(d3.extent(props.data, (d) => new Date(d.date.local)));

  const y = d3.scaleLinear().range([props.height, 0]);
  y.domain([0, 500]);
  const yAxis = d3.axisLeft(y).ticks(5);
  const yAxisGrid = d3
    .axisLeft(y)
    .tickSize(-props.width)
    .tickFormat('')
    .ticks(5);

  const points = props.data.map((o) => {
    return {
      value: o.value,
      cx: x(new Date(o.date.local)),
      cy: y(o.value * 20),
      unit: o.unit,
    };
  });
  const line = d3
    .line()
    .x((d) => x(new Date(d.date.local)))
    .y((d) => y(d.value * 20));

  const area = d3
    .area()
    .x((d) => x(new Date(d.date.local)))
    .y0(props.height)
    .y1((d) => y(d.value));

  createEffect(() => {
    d3.select('.x-aqi-axis').call(d3.axisBottom(x));
    d3.select('.y-aqi-axis').call(yAxis);
    d3.select('.aqi-chart-grid')
      .call(yAxisGrid)
      .selectAll('line,path')
      .style('stroke', '#d4d8dd');
  });

  return (
    <>
      <div style="position:relative;">
        <div
          className="aqi-chart-tooltip"
          style={`${
            tooltipValue()?.visible
              ? 'display:flex;'
              : 'display:none;'
          }left:${tooltipValue()?.x - 90}px; top:${
            tooltipValue()?.y - 25
          }px;`}
        >
          <span className="aqi-chart-tooltip__value">
            {tooltipValue()?.value}
          </span>{' '}
          <span className="aqi-chart-tooltip__unit">
            {tooltipValue()?.unit}
          </span>
        </div>
        <svg
          width={`${props.width + props.margin}px`}
          height={`${props.height + props.margin}px`}
        >
          <g
            className="chart-grid aqi-chart-grid"
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            } )`}
          ></g>

          <g
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          >
            <path
              id="aqiLine"
              className="aqi-chart-line"
              stroke-linejoin="round"
              d={line(props.data)}
            />
            <For each={points}>
              {(item) => (
                <circle
                  className={`aqi-${aqiValue(
                    item.value * 20
                  )}-chart-point`}
                  cx={item.cx}
                  cy={item.cy}
                  r={5}
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
            class="y-aqi-axis"
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          ></g>
          <g
            class="x-aqi-axis"
            transform={`translate(${props.margin / 2} ${
              props.height + props.margin / 2
            })`}
          ></g>
        </svg>
      </div>
    </>
  );
}
