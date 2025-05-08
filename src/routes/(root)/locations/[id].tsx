import { createAsync, Params, useParams } from '@solidjs/router';
import { DetailOverview } from '~/components/DetailOverview';
import { DetailCharts } from '~/components/DetailCharts';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { DownloadCard, NotLoggedInFallback } from '~/components/DownloadCard';
import { LocationDetailOpenGraph } from '~/components/OpenGraph';
import { ErrorBoundary, Show } from 'solid-js';
import { useStore } from '~/stores';
import 'maplibre-gl/dist/maplibre-gl.css';
import '~/assets/scss/routes/location.scss';
import { getLocationById, sensorNodeLists } from '~/db/lists';
import { getSessionUser } from '~/auth/session';
import { getLocationLicenses } from '~/client';
import { NotFoundMessage } from '~/components/NotFoundMessage/NotFoundMessage';
import InfoIcon from '~/assets/imgs/svgs/info.svg';

export const route = {
  preload: ({ params }: { params: Params }) => {
    getSessionUser();
    getLocationById(Number(params.id));
    sensorNodeLists(Number(params.id));
    getLocationLicenses(Number(params.id));
  },
};

export default function Location() {
  const { id } = useParams();
  const [_, { setSelectedLocationsId }] = useStore();

  setSelectedLocationsId(Number(id));

  const user = createAsync(() => getSessionUser(), {
    deferStream: true,
  });

  const location = createAsync(
    () => getLocationById(Number(id)).catch(() => null),
    {
      deferStream: true,
    }
  );

  const licenses = createAsync(() => getLocationLicenses(Number(id)), {
    deferStream: true,
  });

  return (
    <>
      <ErrorBoundary fallback={() => <NotFoundMessage />}>
        <Show when={location()} fallback={<NotFoundMessage />}>
          <LocationDetailOpenGraph
            locationsId={Number(id)}
            locationName={location()?.name}
          />

          <main class="location-main">
            <div class="breadcrumb-container">
              <Breadcrumbs pageName={location()?.name} />
              <section class="getting-started-section">
                <InfoIcon
                  viewBox="0 0 25 25"
                  role="img"
                  aria-label="Info Icon"
                  class="info-icon"
                />
                <a href="/getting-started" class="getting-started-link">
                  Learn how to use the Explorer
                </a>
              </section>
            </div>
            <DetailOverview {...location()} licenses={licenses()} user={user} />
            <Show when={location().datetimeFirst}>
              <DetailCharts {...location()} />
              <section id="download-card" class="download-card">
                <header class="download-card__header">
                  <h3 class="heading">Download</h3>
                </header>
                <Show when={user()?.usersId} fallback={<NotLoggedInFallback />}>
                  <DownloadCard {...location()} />
                </Show>
              </section>
            </Show>
          </main>
        </Show>
      </ErrorBoundary>
    </>
  );
}
