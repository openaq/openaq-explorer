import { useStore } from '~/stores';
import { For, Show, createEffect, createSignal } from 'solid-js';
import { getLocation, getSensorRecentMeasurements } from '~/client';
import { A, createAsync, useLocation } from '@solidjs/router';
import { since, timeFromNow } from '~/lib/utils';
import { ListsForm } from './ListsForm';
import { Sparkline } from '~/components/Charts/Sparkline';
import CloseIcon from '~/assets/imgs/close.svg';
import ArrowRightIcon from '~/assets/imgs/arrow_right.svg';

import '~/assets/scss/components/location-detail-card.scss';
import { getSessionUser } from '~/auth/session';

export function LocationDetailCard() {
  const user = createAsync(() => getSessionUser());
  const pageLocation = useLocation();

  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '#FFFFFF',
  };

  const [
    store,
    { clearLocationsId, setRecentMeasurements, updateRecentMeasurements },
  ] = useStore();

  const [location, setLocation] = createSignal();

  createEffect(async () => {
    if (store.locationsId) {
      setLocation(await getLocation(store.locationsId));
      const sensors = location().results[0].sensors;
      setRecentMeasurements([]);
      const recentMeasurement = sensors.map((o) => {
        const [series, setSeries] = createSignal([]);
        const [loading, setLoading] = createSignal(true);

        return {
          parameter: `${o.parameter.displayName} ${o.parameter.units}`,
          loading,
          setLoading,
          series,
          setSeries,
        };
      });
      setRecentMeasurements(recentMeasurement);
      for (const sensor of sensors) {
        const measurements = await getSensorRecentMeasurements(
          sensor,
          location().results[0].timezone
        );
        updateRecentMeasurements(
          `${sensor.parameter.displayName} ${sensor.parameter.units}`,
          measurements
        );
      }
    }
  });

  return (
    <div
      class={`location-detail-card ${
        store.locationsId ? '' : 'location-detail-card--translate'
      }`}
    >
      <header class="location-detail-card__header">
        <div>
          <h3 class="type-heading-3 text-white">
            {location()?.results?.[0].name?.slice(0, 20) || 'No label'}
          </h3>
        </div>
        <div>
          <button class="close-btn" onClick={() => clearLocationsId()}>
            {' '}
            <CloseIcon {...svgAttributes} />
          </button>
        </div>
      </header>
      <div class="location-detail-card__body">
        <section class="section">
          <span class="type-body-3">
            {location()?.results?.[0].country.name}
          </span>
        </section>
        <section class="section-grid">
          <span class="type-subtitle-3">Type</span>
          <span class="type-body-1">
            {location()?.results?.[0].isMonitor
              ? 'Reference grade'
              : 'Air sensor'}
          </span>
          <span class="type-subtitle-3">Measures</span>
          <span class="type-body-1">
            {location()
              ?.results?.[0].sensors.map(
                (o) => `${o.parameter.displayName} ${o.parameter.units}`
              )
              .join(', ')}
          </span>
        </section>
        <section class="section-grid">
          <span class="type-subtitle-3">Source</span>
          <span class="type-body-1">
            {location()?.results?.[0].provider.name}
          </span>
          <span class="type-subtitle-3">Reporting</span>
          <div class="reporting-cell">
            <span class="type-body-1">
              {location()?.results?.[0].datetimeLast
                ? `Updated ${timeFromNow(
                    location()?.results?.[0].datetimeLast?.local
                  )}`
                : 'No measurements'}
            </span>
            <span class="type-body-4">
              {location()?.results?.[0].datetimeFirst
                ? `Reporting since ${since(
                    location()?.results?.[0].datetimeFirst?.local
                  )}`
                : 'No measurements'}
            </span>
          </div>
        </section>
        <section class="recent-measurements">
          <span class="type-subtitle-3">Latest Readings </span>
          <span class="type-body-1">(last 24 hours) </span>
          <Show when={store.recentMeasurements && location()}>
            <For each={store.recentMeasurements}>
              {(parameter, i) => {
                return (
                  <>
                    <span class="type-subtitle-3">{parameter.parameter}</span>
                    {parameter.series().length ? (
                      <Sparkline
                        series={parameter.series()}
                        timezone={location()?.timezone}
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
                    ) : parameter.loading() ? (
                      <span class="type-body-1">Loading...</span>
                    ) : (
                      <span class="type-body-1">No recent measurements</span>
                    )}
                  </>
                );
              }}
            </For>
          </Show>
        </section>
      </div>
      <footer class="location-detail-card__footer">
        <Show when={user()?.usersId}>
          <ListsForm redirect={pageLocation.pathname} />
        </Show>
        <A
          href={`/locations/${store.locationsId}`}
          class="icon-btn btn-primary"
        >
          Show Details <ArrowRightIcon {...svgAttributes} />
        </A>
      </footer>
    </div>
  );
}
