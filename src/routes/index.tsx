import { Header } from '~/components/Header';
import { Map } from '~/components/Map';
import { getUser } from '~/db';

import '~/assets/scss/map.scss';

import { LocationDetailCard } from '~/components/Cards/LocationDetailCard';

import { FlipCard } from '~/components/Cards/FlipCard';

export const route = {
  load: () => getUser(),
};

export default function Home() {
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
