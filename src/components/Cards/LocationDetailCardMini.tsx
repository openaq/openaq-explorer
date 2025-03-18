import { useStore } from '~/stores';
import { Show, createEffect, createSignal } from 'solid-js';
import { getLocation } from '~/client';
import { A, createAsync, useLocation } from '@solidjs/router';
import { since, timeFromNow } from '~/lib/utils';
import { ListsForm } from './ListsForm';
import CloseIcon from '~/assets/imgs/close.svg';
import ChevronRightIcon from '~/assets/imgs/chevron_right.svg';

import '~/assets/scss/components/location-detail-card-mini.scss';
import { getSessionUser } from '~/auth/session';

export function LocationDetailCardMini() {
  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '#FFFFFF',
  };
  const pageLocation = useLocation();

  const user = createAsync(() => getSessionUser(), { deferStream: true });

  const [store, { clearLocationsId }] = useStore();

  const [location, setLocation] = createSignal();

  createEffect(async () => {
    if (store.locationsId) {
      setLocation(await getLocation(store.locationsId));
    }
  });

  return (
    <div
      class={`location-detail-card-mini ${
        store.locationsId ? '' : 'location-detail-card-mini--translate'
      }`}
    >
      <header class="location-detail-card-mini__header">
        <div>
          <h3 class="type-heading-3 text-white">
            {location()?.results?.[0].name}
          </h3>
        </div>
        <div>
          <button class="close-btn" onClick={() => clearLocationsId()}>
            {' '}
            <CloseIcon {...svgAttributes} />{' '}
          </button>
        </div>
      </header>
      <div class="location-detail-card-mini__body">
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
                    location()?.results?.[0].datetimeFirst?.local
                  )}`
                : 'No measurements'}
            </span>
            <span class="type-body-4">
              {location()?.results?.[0].datetimeLast
                ? `Reporting since ${since(
                    location()?.results?.[0].datetimeFirst?.local
                  )}`
                : 'No measurements'}
            </span>
          </div>
        </section>
      </div>
      <footer class="location-detail-card-mini__footer">
        <Show when={user()?.usersId}>
          <ListsForm redirect={pageLocation.pathname} />
        </Show>
        <A
          href={`/locations/${store.locationsId}`}
          class="icon-btn btn-primary"
        >
          Show Details <ChevronRightIcon {...svgAttributes} />
        </A>
      </footer>
    </div>
  );
}
