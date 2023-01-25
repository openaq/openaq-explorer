import { Link } from '@solidjs/router';
import Sparkline from '../Charts/Sparkline';
import { useStore } from '../../stores';
import dayjs from 'dayjs/esm/index.js';
import { group } from 'd3';

import Progress from '../Charts/Progress';
import relativeTime from 'dayjs/plugin/relativeTime';
import { For } from 'solid-js';
import {
  LowCostSensorMarker,
  ReferenceGradeMarker,
} from '../LocationMarker';

dayjs.extend(relativeTime);

export default function LocationDetailCard() {
  const [store, { clearLocation }] = useStore();

  function timeFromNow(lastUpdated) {
    return `Updated ${dayjs(lastUpdated).fromNow()}`;
  }

  function since(lastUpdated) {
    return `Since ${dayjs(lastUpdated).format('DD/MM/YYYY')}`;
  }

  function latestMeasurementTime(lastUpdated) {
    return dayjs(lastUpdated).format('HH:mm');
  }

  const seriesData = () => {
    if (store.recentMeasurements()) {
      const groups = group(
        store.recentMeasurements(),
        (d) => d.parameter
      );
      return Array.from(groups, (item) => {
        return { key: item[0], values: item[1] };
      });
    }
  };

  store.recentMeasurements()?.reduce((r, a) => {
    r[a.parameter] = r[a.parameter] || [];
    r[a.parameter].push(a);
    return r;
  }, Object.create(null));

  const series = [
    {
      locationId: 2178,
      location: 'Del Norte',
      parameter: 'pm25',
      value: 11.2,
      date: {
        utc: '2022-09-10T16:00:00+00:00',
        local: '2022-09-10T10:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
      value: 9.6,
      date: {
        utc: '2022-09-10T15:00:00+00:00',
        local: '2022-09-10T09:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
      value: 9.2,
      date: {
        utc: '2022-09-10T14:00:00+00:00',
        local: '2022-09-10T08:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
      value: 9.0,
      date: {
        utc: '2022-09-10T13:00:00+00:00',
        local: '2022-09-10T07:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
        utc: '2022-09-10T12:00:00+00:00',
        local: '2022-09-10T06:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
        utc: '2022-09-10T11:00:00+00:00',
        local: '2022-09-10T05:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
      value: 7.7,
      date: {
        utc: '2022-09-10T10:00:00+00:00',
        local: '2022-09-10T04:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
        utc: '2022-09-10T09:00:00+00:00',
        local: '2022-09-10T03:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
      value: 8.4,
      date: {
        utc: '2022-09-10T08:00:00+00:00',
        local: '2022-09-10T02:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
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
      value: 9.9,
      date: {
        utc: '2022-09-10T07:00:00+00:00',
        local: '2022-09-10T01:00:00-06:00',
      },
      unit: 'µg/m³',
      coordinates: { latitude: 35.1353, longitude: -106.584702 },
      country: 'US',
      city: 'Albuquerque',
      isMobile: false,
      isAnalysis: false,
      entity: 'government',
      sensorType: 'reference grade',
    },
  ];

  return (
    <article
      className={`dismissable-card location-detail-card ${
        !store.id || store.help.active
          ? 'dismissable-card--translate'
          : ''
      }`}
    >
      <header className="location-detail-card__header">
        <h3 className="map-card-title">
          {store.location ? store.location?.name : 'Loading...'}
        </h3>
        <button className="close-btn" onClick={() => clearLocation()}>
          <span class="material-symbols-outlined clickable-icon white">
            close
          </span>
        </button>
      </header>
      <div
        className={`map-card__body  ${
          store.location ? '' : 'loading-shimmer'
        }`}
      >
        <section className="map-card-section">
          <span className="type-body-2">
            {store.location?.locality
              ? store.location?.locality
              : 'No city listed'}
            ,
          </span>{' '}
          <span className="type-body-3">
            {store.location?.country.name}
          </span>
        </section>
        <hr className="hr" />
        <section className="map-card-section">
          <div
            style="display: grid; row-gap: 10px; column-gap: 10px;
    grid-template-columns: 1fr 2fr;"
          >
            <div>Type:</div>
            <div>
              {store.location?.isMonitor ? 'Monitor' : 'Air sensor'}{' '}
              <Show
                when={store.location?.isMonitor}
                fallback={<LowCostSensorMarker />}
              >
                <ReferenceGradeMarker />
              </Show>{' '}
            </div>
            <div>Measures:</div>
            <div>
              <For each={store.location?.sensors}>
                {(sensor, i) => (
                  <span className="parameter-label type-body-1">
                    {sensor.parameter.name} ({sensor.parameter.units}
                    ),
                  </span>
                )}
              </For>
            </div>
          </div>
        </section>
        <hr className="hr" />
        <section className="map-card-section">
          <div
            style="display: grid; row-gap: 10px; column-gap: 10px;
grid-template-columns: 1fr 2fr;"
          >
            <div>Provider:</div>{' '}
            <div>
              {store.location?.provider.url ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={store.location?.provider.url}
                >
                  {store.location?.provider.name}
                </a>
              ) : (
                <span>{store.location?.provider.name}</span>
              )}
            </div>
            <div>Reporting: </div>
            <div>
              {timeFromNow(store.location?.datetimeLast.local)}
              <div>
                <span class="body4 smoke120">
                  {since(store.location?.datetimeFirst.local)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <hr className="hr" />
        <section className="map-card-section recent-readings">
          <header className="location-detail-card-section-heading recent-readings__header">
            <span className="type-subtitle-3">Latest Readings </span>
            <span class="type-body-2 text-smoke-100">
              {`${latestMeasurementTime(
                store.location?.datetimeLast.local
              )} (local time)`}
            </span>
          </header>
          <div class="recent-readings__body">
            <For each={seriesData()}>
              {(parameter) => {
                return (
                  <>
                    <span class="type-subtitle-3">
                      {parameter.key}
                    </span>
                    <div>
                      <span className="type-body-3 text-lavender-100">
                        {parameter.values[0].value}{' '}
                      </span>
                      <span className="type-body-1">
                        {parameter.values[0].unit}
                      </span>
                    </div>
                    <Sparkline
                      series={parameter.values.slice(-24)}
                      width={78}
                      height={14}
                      margin={{
                        top: 1,
                        right: 1,
                        bottom: 1,
                        left: 1,
                      }}
                      style={{
                        strokeColor: '#5d48f4',
                        stokeWidth: '3',
                        fill: 'none',
                      }}
                    />
                  </>
                );
              }}
            </For>

            <For each={store.location?.parameters}>
              {(parameter, i) => {
                return (
                  <>
                    <span className="type-subtitle-3">
                      {parameter.displayName}
                    </span>
                    <div>
                      <span className="type-body-3 text-lavender-100">
                        {parameter.lastValue}
                      </span>{' '}
                      <span className="type-body-1">
                        {parameter.unit}
                      </span>
                    </div>
                    <Sparkline
                      series={series}
                      width={78}
                      height={14}
                      margin={{
                        top: 1,
                        right: 1,
                        bottom: 1,
                        left: 1,
                      }}
                      style={{
                        strokeColor: '#5d48f4',
                        stokeWidth: '3',
                        fill: 'none',
                      }}
                    />
                  </>
                );
              }}
            </For>
          </div>
        </section>
      </div>
      <footer className="location-detail-card__footer">
        <Link
          disabled
          className={`icon-btn btn-primary ${
            store.location ? '' : ' btn-primary--disabled'
          }`}
          href={
            store.location ? `/locations/${store.location.id}` : ''
          }
        >
          Show Details
          <span class="material-symbols-outlined white">
            arrow_right_alt
          </span>
        </Link>
      </footer>
    </article>
  );
}
