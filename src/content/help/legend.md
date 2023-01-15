# Legend

When showing a pollutant overlay on the map, the map displays the most recent value for locations. To visualize the range of data on the map view each pollutant is visualized on a scale based on common breaks of 6 levels. For example the PM2.5 scale is bucketed to the following values:

* 0-12
* 12.1-35.4
* 35.5-55.4
* 55.5-150.4
* 150.5-250.4
* 250.5-500
* 501+

This scale closely reflects the concentration levels used to calculate the air quality index (AQI). Occasionally negative values are recieved by the OpenAQ system, all negative values are symbolized with grey. 

Air quality monitoring locations are symbolized a couple ways to help differentiate between reference monitors and air sensors (commonly known as low-cost sensors).

Reference monitors are symbolized as:

<div class="reference-grade-marker">
    <div class="reference-grade-marker__border"></div>
    <div class="reference-grade-marker__fill"></div>
</div>

Air sensors are symbolized as: 

<div class="low-cost-sensor-marker">
    <div class="low-cost-sensor-marker__fill"></div>
</div>

For locations that have recorded measurements historically but have not received a measurement in the last 48 hours are symbolized as: 

<div class="no-recent-data-marker">
    <div class="no-recent-data-marker__border"></div>
    <div class="no-recent-data-marker__fill"></div>
    <div class="no-recent-data-marker__dot"></div>
</div>