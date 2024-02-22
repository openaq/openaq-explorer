import style from './FlipCard.module.scss';
import {ProvidersCard } from './ProvidersCard';
import {OverlayCard} from './OverlayCard';
import { useStore } from '~/stores';

export function FlipCard() {

    const [store] = useStore();
    return (
        <div
        class={`${style['flip-card']} ${store.showProvidersCard ? style['flip-card--active'] : ''} ${
          store.locationsId ? style['flip-card--translate'] : ''
        }`}>
        <div class={style['flip-card-inner']}>
          <div class={style['flip-card-front']}>
            <OverlayCard />
          </div>
          <div class={style['flip-card-back']}>
            <ProvidersCard />
          </div>
        </div>
      </div>
        
    )
}