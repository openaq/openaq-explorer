import { Map } from '~/components/Map';
import { getUserId } from '~/db';
import { LocationDetailCard } from '~/components/Cards/LocationDetailCard';
import { FlipCard } from '~/components/Cards/FlipCard';
import { Header } from '~/components/Header';

import '~/assets/scss/routes/index.scss';
import { useLocation, useNavigate } from '@solidjs/router';
import { useStore } from '~/stores';
import { createEffect, onMount } from 'solid-js';

export const route = {
  load: () => getUserId(),
};

export default function Home() {
  const [store, { setSelectedLocationsId }] = useStore();

  const location = useLocation();
  const navigate = useNavigate();

  onMount(() => {
    if (location.query.location) {
      setSelectedLocationsId(Number(location.query.location));
    }
  })

  createEffect(() => {
    if (store.locationsId !== undefined) {
      navigate(`${location.pathname}?location=${store.locationsId}${location.hash}`);
    } else {
      navigate(`${location.pathname}${location.hash}`);
    }
  });

  return (
    <>
      <Header />
      <main>
        <Map />
        <FlipCard />
        <LocationDetailCard />
      </main>
    </>
  );
}
