import FilterCard from './FilterCard';
import LocationDetailCard from './LocationDetailCard';
import OverlayCard from './OverlayCard';
import { useStore } from '../../stores';

export default function MapCards() {
  const [store] = useStore();

  return (
    <div
      className={`map-cards ${
        store.help.active ? 'map-cards--translate' : ''
      }`}
    >
      <OverlayCard />
      <FilterCard />
      <LocationDetailCard name={store.location?.name} />
    </div>
  );
}
