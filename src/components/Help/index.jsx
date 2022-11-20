import { useStore } from '../../stores';

import { lazy } from 'solid-js';

const helpContent = {
  pollutants: lazy(() => import('./PollutantHelp')),
  thresholds: lazy(() => import('./ThresholdsHelp')),
  legend: lazy(() => import('./LegendHelp')),
  aqi: lazy(() => import('./AqiHelp')),
};

export default function HelpCard(props) {
  const [store, { toggleHelp }] = useStore();

  return (
    <article
      class={`dismissable-card map-card ${
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
      <section className="map-card__body">
        {helpContent[store.help.content]}
      </section>
      <footer className="map-card__footer">
        <button class="btn btn-primary icon-btn">
          <span>More Help</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </article>
  );
}
