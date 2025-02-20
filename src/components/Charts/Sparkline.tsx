import { min, max, scaleLinear, scaleTime, line } from 'd3';
import { createEffect, createSignal } from 'solid-js';
import { transform } from './utils';
import { SparklineDefinition, DataPoint, SeriesData } from './types';

import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(tz);

export function Sparkline(props: SparklineDefinition) {
  const [data, setData] = createSignal<SeriesData[]>(transform(props.series));

  const now = dayjs(new Date(), props.timezone).toDate();
  const yesterday = dayjs(
    new Date().getTime() - 86400000,
    props.timezone
  ).toDate();

  const x = scaleTime().range([0, props.width]);
  x.domain([yesterday, now] as [Date, Date]);

  const yScale = () => {
    const y = scaleLinear().range([props.height, 0]);
    y.domain([
      min(data(), (d: DataPoint) => d.value),
      max(data(), (d: DataPoint) => d.value),
    ] as number[]);
    return y;
  };
  let y = yScale();

  const generateLine = line<DataPoint>()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  createEffect(() => {
    setData(transform(props.series));
    y = yScale();
  });

  return (
    <svg
      width={`${props.width + props.margin.left + props.margin.right}px`}
      height={`${props.height + props.margin.top + props.margin.bottom}px`}
    >
      <g transform={`translate(${props.margin.left} ${props.margin.top})`}>
        <path
          style={{
            fill: props.style.fill,
            stroke: props.style.color,
            'stroke-width': props.style.width,
          }}
          d={generateLine(data()) as string}
        />
      </g>
    </svg>
  );
}
