import { createAsync, useParams } from '@solidjs/router';
import { DetailOverview } from '~/components/DetailOverview';
import { DetailCharts } from '~/components/DetailCharts';
import { getLocation, getUserId, getListsBySensorNodesId } from '~/db';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { DownloadCard } from '~/components/DownloadCard';
import { Show } from 'solid-js';
import { useStore } from '~/stores';
import 'maplibre-gl/dist/maplibre-gl.css';
import '~/assets/scss/routes/location.scss'
import { Header } from '~/components/Header';


export const route = {
  load({ params} : any ) {
    void getLocation(params.id);
    void getListsBySensorNodesId(params.id);
    void getUserId();
  },
};

export default function Location() {
  const { id } = useParams();
  const [store, {setSelectedLocationsId}] = useStore();

  setSelectedLocationsId(Number(id));

  const location = createAsync(() => getLocation(Number(id)), {
    deferStream: true,
  });

  return (
    <>
      <Header />
      <main class="location-main">
        <Show when={location()}>
          <Breadcrumbs pageName={location()?.name} />
          <DetailOverview {...location()}/>
          <DetailCharts {...location()} />
          <DownloadCard {...location()} />
        </Show>
      </main>
      </>
  );
}
