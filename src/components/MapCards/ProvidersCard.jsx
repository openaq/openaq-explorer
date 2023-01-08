import { createEffect, For } from 'solid-js';
import { createSignal } from 'solid-js';
import { useStore } from '../../stores';

function ProviderSearch(providers, setProviders) {
  let timeout;
  const onInput = (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const value = e.target.value;
    }, 500);
  };

  return (
    <input type="text" className="search-input" onInput={onInput} />
  );
}

function ProviderSelect(props) {
  const [store, { excludeProvider }] = useStore();
  const [checked, setChecked] = createSignal(true);

  return (
    <>
      <span class="provider-name">{props.provider.sourceName}</span>
      <input
        type="checkbox"
        name={`source-${props.provider.id}`}
        id={`source-${props.provider.id}`}
        className="checkbox"
        checked={props.allChecked() ? true : checked()}
        onChange={(e) => {
          setChecked(e.target.checked);
          if (!e.target.checked) {
            excludeProvider(props.provider.id);
          }
        }}
      />
    </>
  );
}

export default function ProvidersCard() {
  const [store, { toggleProviderList }] = useStore();

  const [allChecked, setAllChecked] = createSignal(true);

  const [providers, setProviders] = createSignal(store.providers());

  const [activeProviders, setActiveProviders] = createSignal(
    store.providers()
  );

  const onProviderClick = (e) => {};

  const toggleAll = () => {};

  return (
    <article
      className={`card map-card ${
        store.providerListActive ? '' : ''
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
              onChange={(e) => setAllChecked(e.target.checked)}
            />
          </div>
        </section>
        <section className="map-card-section">
          <ProviderSearch />

          <ul className="providers-list">
            <For each={providers()}>
              {(provider, i) => (
                <li className="providers-list__item">
                  <ProviderSelect
                    provider={provider}
                    allChecked={allChecked}
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
