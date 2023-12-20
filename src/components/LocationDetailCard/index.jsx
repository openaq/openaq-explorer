import Sparkline from '../Charts/Sparkline';
import { useStore } from '../../stores';
import dayjs from 'dayjs/esm/index.js';
import { group } from 'd3';

import relativeTime from 'dayjs/plugin/relativeTime';
import { For, Show, createEffect, createSignal } from 'solid-js';
import {
  LowCostSensorMarker,
  ReferenceGradeMarker,
} from '../LocationMarker';

dayjs.extend(relativeTime);

export default function LocationDetailCard() {
  const [store, { clearLocation }] = useStore();

  const [locationid, setLocationId] = createSignal();

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
        (d) => d.parameter.name
      );
      const values = Array.from(groups, (item) => {
        return { key: item[0], values: item[1] };
      });
      return values;
    }
  };

  createEffect(() => {
    const locationId = localStorage.getItem('locationid');
    setLocationId(locationId);
  });

  store.recentMeasurements()?.reduce((r, a) => {
    r[a.parameter] = r[a.parameter] || [];
    r[a.parameter].push(a);
    return r;
  }, Object.create(null));

  return (
    <Article
      class={`dismissable-card location-detail-card ${
        !store.id || store.help.active
          ? 'dismissable-card--translate'
          : ''
      }`}
    >
      <header class="location-detail-card__header">
        <h3 class="map-card-title">
          {store.location ? store.location?.name : 'Loading...'}
        </h3>
        <button class="close-btn" onClick={() => clearLocation()}>
          <span class="material-symbols-outlined clickable-icon white">
            close
          </span>
        </button>
      </header>
      <div class={`map-card__body`}>
        <section class="map-card-section">
          <span class="type-body-2">
            {store.location?.locality
              ? store.location?.locality
              : 'No city listed'}
            ,
          </span>{' '}
          <span class="type-body-3">
            {store.location?.country.name}
          </span>
        </section>
        <hr class="hr" />
        <section class="map-card-section">
          <div
            style={{
              display: 'grid',
              'row-gap': '10px',
              'column-gap': '10px',
              'grid-template-columns': '1fr 2fr',
            }}
          >
            <div>Type:</div>
            <div>
              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                  'align-items': 'center',
                }}
              >
                {store.location?.isMonitor ? 'Monitor' : 'Air sensor'}{' '}
                <Show
                  when={store.location?.isMonitor}
                  fallback={<LowCostSensorMarker />}
                >
                  <ReferenceGradeMarker />
                </Show>{' '}
              </div>
            </div>
            <div>Measures:</div>
            <div>
              <For each={store.location?.sensors}>
                {(sensor) => (
                  <span class="parameter-label type-body-1">
                    {sensor.parameter.name} ({sensor.parameter.units}
                    ),
                  </span>
                )}
              </For>
            </div>
          </div>
        </section>
        <hr class="hr" />
        <section class="map-card-section">
          <div
            style={{
              display: 'grid',
              'row-gap': '10px',
              'column-gap': '10px',
              'grid-template-columns': '1fr 2fr',
            }}
          >
            <div>Provider:</div>{' '}
            <div>
              {store.location?.provider.url ? (
                <A
                  target="_blank"
                  rel="noopener noreferrer"
                  href={store.location?.provider.url}
                >
                  {store.location?.provider.name}
                </A>
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

        <hr class="hr" />
        <section class="map-card-section recent-readings">
          <header class="location-detail-card-section-heading recent-readings__header">
            <span class="type-subtitle-3">Latest Readings </span>
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
                      <span class="type-body-3 text-lavender-100">
                        {parameter.values.slice(-1)[0].value}{' '}
                      </span>
                      <span class="type-body-1">
                        {
                          parameter.values.slice(-1)[0].parameter
                            .units
                        }
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
                        color: '#5d48f4',
                        width: '3',
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
      <footer class="location-detail-card__footer">
        <A
          disabled
          class={`icon-btn btn-primary ${
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
        </A>
      </footer>
    </Article>
  );
}
