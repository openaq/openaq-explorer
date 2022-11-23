import { For } from 'solid-js';
import { createSignal } from 'solid-js';
import { useStore } from '../../stores';

function ProviderSearch(providers, setProviders) {}

export default function ProvidersCard() {
  const [store, { toggleProviderList }] = useStore();

  const [providers, setProviders] = createSignal(store.providers());

  const [activeProviders, setActiveProviders] = createSignal(
    store.providers()
  );

  const onProviderClick = (e) => {};

  return (
    <article
      className={`dismissable-card map-card ${
        store.providerListActive ? '' : 'dismissable-card--translate'
      }`}
    >
      <header className="map-card__header">
        <div style="display:flex;">
          <button
            className="close-btn"
            onClick={() => toggleProviderList(false)}
          >
            <span class="material-symbols-outlined white clickable-icon">
              arrow_back
            </span>
          </button>
          <h3 className="map-card-title">Data Providers</h3>
        </div>
      </header>
      <div className="map-card__body">
        <section className="map-card-section">
          <div class="providers-list-subtitle">
            <span class="providers-list-count">
              Show all{' '}
              <span class="providers-list-count__number">
                {providers()?.length}
              </span>{' '}
              data providers
            </span>
            <input
              type="checkbox"
              name="show-all-data-sources"
              id="show-all-data-source"
              className="checkbox"
              checked
            />
          </div>
        </section>
        <section className="map-card-section">
          <input type="text" className="search-input" />

          <ul className="providers-list">
            <For each={providers()}>
              {(provider, i) => (
                <li className="providers-list__item">
                  <span class="provider-name">
                    {provider.sourceName}
                  </span>
                  <input
                    type="checkbox"
                    name={`source-${provider.id}`}
                    id={`source-${provider.id}`}
                    className="checkbox"
                    checked
                  />
                </li>
              )}
            </For>
          </ul>
        </section>
      </div>
      <footer className="map-card__footer">
        <button className="btn btn-primary">Update</button>
      </footer>
    </article>
  );
}
