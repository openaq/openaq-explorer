import { ProvidersCard } from './ProvidersCard';
import { OverlayCard } from './OverlayCard';
import { PartnersCard } from './PartnersCard';
import { useStore } from '~/stores';
import { Show } from 'solid-js';
import '~/assets/scss/components/flip-card.scss';

export function FlipCard() {
  const [store] = useStore();

  return (
    <div
      class={`flip-card ${store.showProvidersCard || store.showPartnersCard ? 'flip-card--active' : ''} ${
        store.locationsId || store.showHelpCard ? 'flip-card--translate' : ''
      }`}
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <OverlayCard />
        </div>
        <Show when={store.showProvidersCard}>
          <div class="flip-card-back">
            <ProvidersCard />
          </div>
        </Show>
        <Show when={store.showPartnersCard}>
          <div class="flip-card-back">
            <PartnersCard />
          </div>
        </Show>
      </div>
    </div>
  );
}
