import {
  extent,
  min,
  max,
  scaleLinear,
  scaleTime,
  line,
  isoParse,
} from 'd3';
import { createEffect } from 'solid-js';

function transform(data) {
  return data.map((o) => {
    return {
      value: parseFloat(o.value),
      date: isoParse(o.period.datetimeTo.local),
    };
  });
}

export default function Sparkline(props) {
  const data = transform(props.series);
  const x = scaleTime().range([0, props.width]);
  const y = scaleLinear().range([props.height, 0]);
  x.domain(extent(data, (d) => d.date));
  y.domain([min(data, (d) => d.value), max(data, (d) => d.value)]);

  const generateLine = line()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  createEffect(() => {});

  return (
    <svg
      width={`${
        props.width + props.margin.left + props.margin.right
      }px`}
      height={`${
        props.height + props.margin.top + props.margin.bottom
      }px`}
    >
      <g
        transform={`translate(${props.margin.left} ${props.margin.top})`}
      >
        <path
          style={{
            fill: props.style.fill,
            stroke: props.style.color,
            'stroke-width': props.style.width,
          }}
          d={generateLine(data)}
        />
      </g>
    </svg>
  );
}
