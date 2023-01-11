import { createEffect, For } from 'solid-js';
import { createSignal } from 'solid-js';
import { useStore } from '../../stores';
import MiniSearch from 'minisearch';

function ProviderSearch(props) {
  const [store] = useStore();
  const [count, setCount] = createSignal(0);

  const miniSearch = new MiniSearch({
    fields: ['name'],
    storeFields: ['name'],
  });

  miniSearch.addAll(store.providers());

  createEffect(() => {
    console.log(store.mapFilters.excludedProviders);
  });

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

  const providersCount = store.providers().length;

  return (
    <div>
      <input type="text" className="search-input" onInput={onInput} />
      <span>
        {count() > 0
          ? `Showing ${count()} of ${providersCount} providers`
          : `Showing all ${providersCount} providers`}
      </span>
    </div>
  );
}

function ProviderSelect(props) {
  const [store, { excludeProvider }] = useStore();

  return (
    <>
      <span class="provider-name">{props.provider.sourceName}</span>
      <input
        type="checkbox"
        name={`source-${props.provider.id}`}
        id={`source-${props.provider.id}`}
        className="checkbox"
        checked={
          !store.mapFilters.excludedProviders
            .map((o) => o.id)
            .includes(props.provider.id)
            ? true
            : false
        }
        onChange={(e) => {
          if (!e.target.checked) {
            excludeProvider(props.provider.id);
          }
        }}
      />
    </>
  );
}

export default function ProvidersCard() {
  const [
    store,
    {
      toggleProviderList,
      includeAllProviders,
      excludeAllProviders,
      updateProviders,
    },
  ] = useStore();

  const [providers, setProviders] = createSignal(store.providers());

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
              className="type-link-1"
              onClick={includeAllProviders}
            >
              Select All
            </span>
            <span>|</span>
            <span
              className="type-link-1"
              onClick={excludeAllProviders}
            >
              Select None
            </span>
          </div>
        </section>
        <section className="map-card-section">
          <ProviderSearch setProviders={setProviders} />
          <ul className="providers-list">
            <For each={providers()}>
              {(provider, i) => (
                <li className="providers-list__item">
                  <ProviderSelect provider={provider} />
                </li>
              )}
            </For>
          </ul>
        </section>
      </div>
      <footer className="map-card__footer">
        <button className="btn btn-primary" onClick={updateProviders}>
          Update
        </button>
      </footer>
    </article>
  );
}
