import { useStore } from '../../stores';

import { lazy } from 'solid-js';

const helpContent = {
  pollutants: lazy(() => import('./PollutantHelp')),
  thresholds: lazy(() => import('./ThresholdsHelp')),
  legend: lazy(() => import('./LegendHelp')),
  aqi: lazy(() => import('./AqiHelp')),
};

export default function HelpCard() {
  const [store, { toggleHelp }] = useStore();

  return (
    <article
      class={`help-card dismissable-card map-card explore-card ${
        store.help.active ? '' : 'dismissable-card--translate'
      }`}
    >
      <header class="map-card__header">
        <h3>Help</h3>
        <button class="close-btn" onClick={() => toggleHelp(false)}>
          <span class="material-symbols-outlined clickable-icon white">
            close
          </span>
        </button>
      </header>
      <section class="map-card__body">
        {helpContent[store.help.content]}
      </section>
      <footer class="map-card__footer">
        <a
          class="btn btn-primary icon-btn"
          href="https://openaq.org/developers/help/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>More Help</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </a>
      </footer>
    </article>
  );
}
