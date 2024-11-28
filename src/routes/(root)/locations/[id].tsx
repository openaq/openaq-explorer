import { createAsync, Params, useParams } from '@solidjs/router';
import { DetailOverview } from '~/components/DetailOverview';
import { DetailCharts } from '~/components/DetailCharts';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { DownloadCard, NotLoggedInFallback } from '~/components/DownloadCard';
import { LocationDetailOpenGraph } from '~/components/OpenGraph';
import { Show } from 'solid-js';
import { useStore } from '~/stores';
import 'maplibre-gl/dist/maplibre-gl.css';
import '~/assets/scss/routes/location.scss';
import { getLocationById, sensorNodeLists } from '~/db/lists';
import { getSessionUser } from '~/auth/session';

export const route = {
  preload: ({ params }: { params: Params }) => {
    getSessionUser();
    getLocationById(Number(params.id));
    sensorNodeLists(Number(params.id));
  },
};

export default function Location() {
  const { id } = useParams();
  const [_, { setSelectedLocationsId }] = useStore();

  setSelectedLocationsId(Number(id));

  const user = createAsync(() => getSessionUser(), {
    deferStream: true,
  });

  const location = createAsync(() => getLocationById(Number(id)), {
    deferStream: true,
  });

  return (
    <>
      <LocationDetailOpenGraph
        locationsId={Number(id)}
        locationName={location()?.name}
      />
      <main class="location-main">
        <Show when={location()}>
          <Breadcrumbs pageName={location()?.name} />
          <DetailOverview {...location()} user={user} />
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
        </Show>
      </main>
    </>
  );
}
