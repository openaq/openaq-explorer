import { ProvidersCard } from './ProvidersCard';
import { OverlayCard } from './OverlayCard';
import { PartnersCard } from './PartnersCard';
import { useStore } from '~/stores';
import { Match, Switch } from 'solid-js';
import '~/assets/scss/components/flip-card.scss';

export function FlipCard() {
  const [store] = useStore();

  return (
    <div
      class={`flip-card ${store.isFlipped ? 'flip-card--active' : ''} ${
        store.locationsId || store.showHelpCard ? 'flip-card--translate' : ''
      }`}
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <OverlayCard />
        </div>
        <div class="flip-card-back">
          <Switch>
            <Match when={store.showProvidersCard}>
                <ProvidersCard />
            </Match>
            <Match when={store.showPartnersCard}>
                <PartnersCard />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
