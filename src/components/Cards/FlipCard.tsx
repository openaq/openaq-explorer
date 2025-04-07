import { ProvidersCard } from './ProvidersCard';
import { OverlayCard } from './OverlayCard';
import { useStore } from '~/stores';
import '~/assets/scss/components/flip-card.scss';

export function FlipCard() {
  const [store] = useStore();

  return (
    <div
      class={`flip-card ${store.showProvidersCard ? 'flip-card--active' : ''} ${
        store.locationsId || store.showHelpCard ? 'flip-card--translate' : ''
      }`}
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <OverlayCard />
        </div>
        <div class="flip-card-back">
          <ProvidersCard />
        </div>
      </div>
    </div>
  );
}
