import { createEffect, createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useStore } from '../../stores';
import MiniSearch from 'minisearch';

function ProviderSearch(props) {
  const [store] = useStore();
  const [count, setCount] = createSignal(0);

  const miniSearch = new MiniSearch({
    fields: ['name'],
    storeFields: ['name'],
  });

  if (store.providers()) {
    miniSearch.addAll(store.providers());
  }

  let timeout;
  const onInput = (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const value = e.target.value;
      const res = miniSearch.search(value, { prefix: true });
      setCount(res.length);
      props.setProviders(
        res.length
          ? store
              .providers()
              .filter((provider) =>
                res.map((o) => o.id).includes(provider.id)
              )
          : store.providers()
      );
    }, 500);
  };

  const providersCount = store.providers()?.length | 0;

  return (
    <div>
      <input type="text" className="search-input" onInput={onInput} />
      <span>
        {count() > 0
          ? `Listing ${count()} of ${providersCount} providers`
          : `Listing all ${providersCount} providers`}
      </span>
    </div>
  );
}

export default function ProvidersCard() {
  const [store, { toggleProviderList, updateProviders }] = useStore();

  const [providers, setProviders] = createStore([]);

  createEffect(() => {
    if (store.providers.state == 'ready') {
      setProviders(
        store
          .providers()
          .map((o) => {
            return {
              name: o.sourceName,
              id: o.id,
              checked: true,
            };
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1))
      );
    }
  });

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
            <span
              className="type-link-1 providers-list-select-all"
              onClick={() =>
                setProviders(() => true, 'checked', true)
              }
            >
              Select All
            </span>
            <span>|</span>
            <span
              className="type-link-1 providers-list-select-none"
              onClick={() => {
                setProviders(() => true, 'checked', false);
              }}
            >
              Select None
            </span>
          </div>
          <div>
            <span>
              {providers.filter((o) => o.checked).length} providers
              selected
            </span>
          </div>
        </section>
        <section className="map-card-section">
          <ProviderSearch setProviders={setProviders} />
          <ul className="providers-list">
            <For each={providers}>
              {(provider, i) => (
                <li className="providers-list__item">
                  <span class="provider-name">{provider.name}</span>
                  <input
                    type="checkbox"
                    name={`source-${provider.id}`}
                    id={`source-${provider.id}`}
                    className="checkbox"
                    value={provider.id}
                    checked={provider.checked}
                    onChange={(e) => {
                      setProviders(i(), 'checked', e.target.checked);
                    }}
                  />
                </li>
              )}
            </For>
          </ul>
        </section>
      </div>
      <footer className="map-card__footer">
        <button
          className={`update-providers-btn btn btn-primary ${
            providers.filter((o) => o.checked).length > 0
              ? ''
              : 'btn-primary--disabled'
          }`}
          disabled={providers.filter((o) => o.checked).length == 0}
          onClick={() =>
            updateProviders(providers.filter((o) => o.checked))
          }
        >
          Update
        </button>
      </footer>
    </article>
  );
}
