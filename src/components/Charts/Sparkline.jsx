import {
  extent,
  min,
  max,
  scaleLinear,
  scaleTime,
  line,
  isoParse,
} from 'd3';

function transform(data) {
  return data.map((o) => {
    return {
      value: parseFloat(o.value),
      date: isoParse(o.period.datetimeTo.local),
    };
  });
}

export default function Sparkline({
  series,
  width,
  height,
  margin,
  style = { fill: 'none', strokeColor: 'black' },
}) {
  const data = transform(series);
  const x = scaleTime().range([0, width]);
  const y = scaleLinear().range([height, 0]);
  x.domain(extent(data, (d) => d.date));
  y.domain([min(data, (d) => d.value), max(data, (d) => d.value)]);

  const generateLine = line()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  return (
    <svg
      width={`${width + margin.left + margin.right}px`}
      height={`${height + margin.top + margin.bottom}px`}
    >
      <g transform={`translate(${margin.left} ${margin.top})`}>
        <path
          style={`fill:${style.fill}; stroke:${style.strokeColor}; stroke-width:${style.stokeWidth}`}
          d={generateLine(data)}
        />
      </g>
    </svg>
  );
}
