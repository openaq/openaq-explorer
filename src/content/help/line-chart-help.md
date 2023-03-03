
# Latest Readings Chart

The latest readings chart shows hourly measurements from the last 24 hours, 48 hours, 72 hours, 1 week or 30 days, starting from the current moment in time. Time values on the x-axis are shown in the location’s local time.

For sensors that report measurements at sub-hour intervals, an average (mean) of the hour is calculated. The hourly averages represent the time-ending values (“ceiling”), e.g., 10:00 represents the average value of measurements from 09:01 to 10:00.

### Logarithmic scale vs linear scale

The chart provides two options for displaying values on the y-axis: linear (default) and logarithmic. The linear scale displays the values position on the y-axis in equal intervals. The logarithmic scale displays the value in exponential intervals, i.e., non-equal intervals. The logarithmic scale option is useful when viewing data with some values diverging greatly from the rest of the data as it can better respond to skewness in the data.

## Why are there gaps in the chart?

In cases where an hourly measurement is missing, a point will not be visible. For missing data points, the connecting trend line is broken to better indicate the missing data. OpenAQ strives to ingest complete data, but sometimes data providers will have reporting outages, report data with a large delay, or experience device issues.

## Why does the chart show negative readings?

Some instruments may occasionally report negative measurement values. Negative concentration values may seem impossible, but instruments may report negative values because of  calibration error, instrument failure, instrument uncertainty and/or poor model selection. QuantAQ explains this issue well on their [blog](https://blog.quant-aq.com/why-is-my-air-quality-monitor-reporting-negative-values-and-what-can-i-do-about-it/).

