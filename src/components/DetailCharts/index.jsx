import LineChart from '../Charts/LineChart';
import { useStore } from '../../stores';
import BoxPlot from '../Charts/BoxPlot';

export default function DetailCharts() {
  const [store] = useStore();

  return (
    <div className="detail-charts">
      <section className="detail-charts__section">
        <div style="display:flex; justify-content: space-between;">
          <div className="header-section">
            <h3 className="detail-section-title">Latest Readings</h3>
            <span class="material-symbols-outlined green">help</span>
          </div>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select">
              <option value="2">PM2.5</option>
            </select>
            <select name="" id="" className="select">
              <option value="1">Last 24 hours</option>
            </select>
            <button className="btn btn-secondary">Update</button>
          </div>
          <span className="chart-help">
            How was this chart calculated?
          </span>
        </div>
        <div>
          <LineChart
            width={1200}
            height={250}
            margin={40}
            data={[
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 3.6,
                date: {
                  utc: '2022-05-03T00:00:00+00:00',
                  local: '2022-05-02T18:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 3.5,
                date: {
                  utc: '2022-05-02T23:00:00+00:00',
                  local: '2022-05-02T17:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 3.5,
                date: {
                  utc: '2022-05-02T22:00:00+00:00',
                  local: '2022-05-02T16:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 3.6,
                date: {
                  utc: '2022-05-02T21:00:00+00:00',
                  local: '2022-05-02T15:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 5.0,
                date: {
                  utc: '2022-05-02T20:00:00+00:00',
                  local: '2022-05-02T14:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 3.7,
                date: {
                  utc: '2022-05-02T19:00:00+00:00',
                  local: '2022-05-02T13:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 3.9,
                date: {
                  utc: '2022-05-02T18:00:00+00:00',
                  local: '2022-05-02T12:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 5.4,
                date: {
                  utc: '2022-05-02T17:00:00+00:00',
                  local: '2022-05-02T11:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 6.6,
                date: {
                  utc: '2022-05-02T16:00:00+00:00',
                  local: '2022-05-02T10:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 8.0,
                date: {
                  utc: '2022-05-02T15:00:00+00:00',
                  local: '2022-05-02T09:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 9.3,
                date: {
                  utc: '2022-05-02T14:00:00+00:00',
                  local: '2022-05-02T08:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 10.5,
                date: {
                  utc: '2022-05-02T13:00:00+00:00',
                  local: '2022-05-02T07:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 1.4,
                date: {
                  utc: '2022-05-02T12:00:00+00:00',
                  local: '2022-05-02T06:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T11:00:00+00:00',
                  local: '2022-05-02T05:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T10:00:00+00:00',
                  local: '2022-05-02T04:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T09:00:00+00:00',
                  local: '2022-05-02T03:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T08:00:00+00:00',
                  local: '2022-05-02T02:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T07:00:00+00:00',
                  local: '2022-05-02T01:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T06:00:00+00:00',
                  local: '2022-05-02T00:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T05:00:00+00:00',
                  local: '2022-05-01T23:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T04:00:00+00:00',
                  local: '2022-05-01T22:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T03:00:00+00:00',
                  local: '2022-05-01T21:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T02:00:00+00:00',
                  local: '2022-05-01T20:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T01:00:00+00:00',
                  local: '2022-05-01T19:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
              {
                locationId: 2178,
                location: 'Del Norte',
                parameter: 'pm25',
                value: 0.0,
                date: {
                  utc: '2022-05-02T00:00:00+00:00',
                  local: '2022-05-01T18:00:00-06:00',
                },
                unit: 'µg/m³',
                coordinates: {
                  latitude: 35.1353,
                  longitude: -106.584702,
                },
                country: 'US',
                city: 'Albuquerque',
                isMobile: false,
                isAnalysis: false,
                entity: 'government',
                sensorType: 'reference grade',
              },
            ]}
          />
        </div>
      </section>
      <section className="detail-charts__section">
        <div class="patterns-container" style="display: grid: "></div>
        <div style="display:flex; justify-content: space-between;">
          <h3>Patterns</h3>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select"></select>
            <select name="" id="" className="select"></select>
            <button className="btn btn-secondary">Update</button>
          </div>
          <span className="chart-help">
            How was this chart calculated?
          </span>
        </div>
        <div>
          <BoxPlot
            name={'time-of-day'}
            width={350}
            height={350}
            data={{
              periods: [
                '01:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
              ],
              summaries: [
                {
                  period: '01:00',
                  median: 1.2,
                  min: 0.4,
                  max: 1.4,
                  q1: 0.9,
                  q3: 1.3,
                },
                {
                  period: '02:00',
                  median: 1.5,
                  min: 1.4,
                  max: 3.4,
                  q1: 1.9,
                  q3: 2.9,
                },
                {
                  period: '03:00',
                  median: 1.4,
                  min: 1.4,
                  max: 3.4,
                  q1: 1.9,
                  q3: 2.9,
                },
                {
                  period: '04:00',
                  median: 1.6,
                  min: 1.4,
                  max: 3.4,
                  q1: 1.9,
                  q3: 2.9,
                },
                {
                  period: '05:00',
                  median: 1.7,
                  min: 1.4,
                  max: 3.4,
                  q1: 1.9,
                  q3: 2.9,
                },
                {
                  period: '06:00',
                  median: 2.0,
                  min: 1.4,
                  max: 3.4,
                  q1: 1.9,
                  q3: 2.9,
                },
                {
                  period: '07:00',
                  median: 2.2,
                  min: 1.2,
                  max: 2.7,
                  q1: 2.0,
                  q3: 2.6,
                },
                {
                  period: '08:00',
                  median: 2.8,
                  min: 1.9,
                  max: 3.4,
                  q1: 2.3,
                  q3: 2.9,
                },
                {
                  period: '09:00',
                  median: 2.6,
                  min: 1.9,
                  max: 3.4,
                  q1: 2.3,
                  q3: 2.9,
                },
                {
                  period: '10:00',
                  median: 1.9,
                  min: 1.2,
                  max: 2.3,
                  q1: 1.6,
                  q3: 2.0,
                },
                {
                  period: '11:00',
                  median: 1.7,
                  min: 1.2,
                  max: 2.1,
                  q1: 1.4,
                  q3: 1.6,
                },
                {
                  period: '12:00',
                  median: 1.5,
                  min: 1.0,
                  max: 2.0,
                  q1: 1.2,
                  q3: 1.9,
                },
              ],
            }}
            margin={50}
          />
          <BoxPlot
            name={'day-of-week'}
            width={350}
            height={350}
            data={{
              periods: [
                'mon',
                'tues',
                'wed',
                'thu',
                'fri',
                'sat',
                'sun',
              ],
              summaries: [
                {
                  period: 'mon',
                  median: 3.2,
                  min: 2.1,
                  max: 4.3,
                  q1: 2.4,
                  q3: 3.5,
                },
                {
                  period: 'tues',
                  median: 12,
                  min: 0.1,
                  max: 36,
                  q1: 1,
                  q3: 20,
                },
                {
                  period: 'wed',
                  median: 5.2,
                  min: 3.2,
                  max: 7,
                  q1: 4.2,
                  q3: 6.9,
                },
                {
                  period: 'thu',
                  median: 5.2,
                  min: 3.2,
                  max: 7,
                  q1: 4.2,
                  q3: 6.9,
                },
                {
                  period: 'fri',
                  median: 52,
                  min: 3.2,
                  max: 99,
                  q1: 4.2,
                  q3: 92,
                },
                {
                  period: 'sat',
                  median: 5.2,
                  min: 3.2,
                  max: 27,
                  q1: 4.2,
                  q3: 6.9,
                },
                {
                  period: 'sun',
                  median: 5.2,
                  min: 3.2,
                  max: 72,
                  q1: 4.2,
                  q3: 6.9,
                },
              ],
            }}
            margin={50}
          />
          <BoxPlot
            name={'month-of-year'}
            width={350}
            height={350}
            data={{
              periods: [
                'mon',
                'tues',
                'wed',
                'thu',
                'fri',
                'sat',
                'sun',
              ],
              summaries: [
                {
                  period: 'mon',
                  median: 3.2,
                  min: 2.1,
                  max: 4.3,
                  q1: 2.4,
                  q3: 3.5,
                },
                {
                  period: 'tues',
                  median: 3.1,
                  min: 0.1,
                  max: 6.4,
                  q1: 2.4,
                  q3: 3.4,
                },
                {
                  period: 'wed',
                  median: 3.2,
                  min: 0.5,
                  max: 7,
                  q1: 2.0,
                  q3: 6.9,
                },
                {
                  period: 'thu',
                  median: 2.9,
                  min: 0.2,
                  max: 5,
                  q1: 2.2,
                  q3: 3.9,
                },
                {
                  period: 'fri',
                  median: 3.4,
                  min: 1.2,
                  max: 4.4,
                  q1: 2.3,
                  q3: 3.7,
                },
                {
                  period: 'sat',
                  median: 1.2,
                  min: 0.6,
                  max: 5.3,
                  q1: 1.0,
                  q3: 3.4,
                },
                {
                  period: 'sun',
                  median: 1.2,
                  min: 0.6,
                  max: 3.3,
                  q1: 0.8,
                  q3: 2.0,
                },
              ],
            }}
            margin={50}
          />
        </div>
      </section>
      <section className="detail-charts__section">
        <div style="display:flex; justify-content: space-between;">
          <h3>Thresholds</h3>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select"></select>
            <span>above</span>
            <select name="" id="" className="select"></select>
            <span>µg/m3</span>
            <input type="date" name="" id="" />
            <button className="btn btn-secondary">Update</button>
          </div>
          <span className="chart-help">
            How was this chart calculated?
          </span>
        </div>
        <div>
          <svg height="250"></svg>
        </div>
      </section>
      <section className="detail-charts__section">
        <div style="display:flex; justify-content: space-between;">
          <h3>Air Quality Index</h3>
        </div>

        <div style="display:flex; justify-content: space-between;">
          <div style="display:flex;">
            <select name="" id="" className="select">
              <option value="">US EPA</option>
            </select>
            <input type="date" name="" id="" />
            <button className="btn btn-secondary">Update</button>
          </div>
          <span>How was this chart calculated?</span>
        </div>
        <div>
          <svg height="250"></svg>
        </div>
      </section>
    </div>
  );
}
