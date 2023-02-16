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
} from 'd3';
import { createSignal, createEffect } from 'solid-js';

export default function LineChart(props) {
  const [tooltipValue, setTooltipValue] = createSignal();
  const [chartData, setChartData] = createSignal(props.data);

  const x = scaleTime().range([0, props.width]);
  const y = scaleLinear().range([props.height, 0]);

  const yAxis = axisLeft(y).ticks(5);
  const yAxisGrid = axisLeft(y)
    .tickSize(-props.width)
    .tickFormat('')
    .ticks(5);

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
      max(
        props.data,
        (d) => d.value + max(props.data, (d) => d.value)
      ),
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
      select('.x-axis').call(axisBottom(x));

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
              dx="10"
              dy="10"
              stdDeviation="3"
              flood-opacity="0.5"
            />
          </filter>

          <g
            transform={`translate(${props.margin / 2} ${
              props.margin / 2
            })`}
          >
            <path className="line-chart-area" d={area(chartData())} />
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
            <path className="line-chart-line" d={line(chartData())} />
            <For each={points(chartData())}>
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
