export interface SeriesData {
  value: number;
  date: Date;
}

export interface Series {
  date: string;
  value: string;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Style {
  fill: string;
  color: string;
  width: string;
}

export interface SparklineDefinition {
  series: Series[];
  timezone: string;
  width: number;
  height: number;
  margin: Margin;
  style: Style;
}

export interface DataPoint {
  date: Date;
  value: number;
}
