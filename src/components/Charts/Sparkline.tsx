import {
  min,
  max,
  scaleLinear,
  scaleTime,
  line,
  isoParse,
} from 'd3';
import { createEffect, createSignal } from 'solid-js';

import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(tz);


function transform(data: Series[]): SeriesData[] {
  return data.map((o) => {
    return {
      value: parseFloat(o.value),
      date: isoParse(o.date)!,
    };
  });
}


interface SeriesData {
  value: number;
  date: Date;
}



interface Series {
  date: string;
  value: string;
}


interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;

}

interface Style {
  fill: string;
  color: string;
  width: string;
}

interface SparklineDefinition {
  series: Series[];
  timezone: string;
  width: number;
  height: number;
  margin: Margin;
  style: Style;
}

interface DataPoint {
  date: Date;
  value: number;
}

export function Sparkline(props: SparklineDefinition) {
  const [data, setData] = createSignal(transform(props.series));

const now = dayjs(new Date(), props.timezone).toDate();
const yesterday = dayjs(
  new Date().getTime() - 86400000,
  props.timezone
).toDate();

  
  const x = scaleTime().range([0, props.width]);
  x.domain([yesterday, now] as [Date, Date]);

  const yScale = () => {
    const y = scaleLinear().range([props.height, 0]);
    y.domain([min(data(), (d: DataPoint) => d.value), max(data(), (d: DataPoint) => d.value)] as number[]);
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
          d={generateLine(data()) as string}
        />
      </g>
    </svg>
  );
}
