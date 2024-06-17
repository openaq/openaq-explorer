import { isoParse } from 'd3';
import { Series, SeriesData } from './types';

export function transform(data: Series[]): SeriesData[] {
  return data.map((o) => {
    return {
      value: parseFloat(o.value),
      date: isoParse(o.date)!,
    };
  });
}
