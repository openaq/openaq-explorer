import FilterOverlayCard from './ExpandableCard';
import ProvidersCard from './ProvidersCard';
import { useStore } from '../../stores';

export default function MapCards() {
  const [store] = useStore();

  return (
    <div
      class={`flip-card explore-card ${
        store.providerListActive ? 'flip-card--active' : ''
      }`}
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <FilterOverlayCard />
        </div>
        <div class="flip-card-back">
          <ProvidersCard />
        </div>
      </div>
    </div>
  );
}
