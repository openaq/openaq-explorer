import { createAsync, useParams } from '@solidjs/router';
import { DetailOverview } from '~/components/DetailOverview';
import { DetailCharts } from '~/components/DetailCharts';
import { getLocation, getUserId, getListsBySensorNodesId } from '~/db';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { DownloadCard } from '~/components/DownloadCard';
import {LocationDetailOpenGraph} from '~/components/OpenGraph';
import { Show } from 'solid-js';
import { useStore } from '~/stores';
import 'maplibre-gl/dist/maplibre-gl.css';
import '~/assets/scss/routes/location.scss'
import { Header } from '~/components/Header';


export const route = {
  preload({ params} : any ) {
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
    <LocationDetailOpenGraph locationsId={Number(id)} locationName={location()?.name}/>
      <Header />
      <main class="location-main">
        <Show when={location()}>
          <Breadcrumbs pageName={location()?.name} />
          <DetailOverview {...location()}/>
          <Show
            when={location().datetimeFirst}
          >
          <DetailCharts {...location()} />
          <DownloadCard {...location()} />
          </Show>
        </Show>
      </main>
      </>
  );
}
