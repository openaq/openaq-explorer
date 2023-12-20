import { Title } from 'solid-start';
import { getUser } from '~/db/session';
import { useRouteData } from 'solid-start';
import { createServerData$, redirect } from 'solid-start/server';
import { Map } from '~/components/Map';
// import { MapCards } from '~/components/MapCards';
import '~/assets/scss/map.scss';

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    return user;
  });
}

export default function Home() {
  const user = useRouteData();

  return (
    <main>
      <Map />
      {/* <MapCards /> */}
    </main>
  );
}
