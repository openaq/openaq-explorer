import { createEffect, createSignal, For, Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { useStore } from '../../stores';
import MiniSearch from 'minisearch';
import bbox from '@turf/bbox';

export default function ProvidersCard() {
  const [
    store,
    { toggleProviderList, updateProviders, setBounds, setViewport },
  ] = useStore();

  const [count, setCount] = createSignal();
  const [providers, setProviders] = createStore([]);
  const [activeProviders, setActiveProviders] = createSignal([]);

  const miniSearch = new MiniSearch({
    fields: ['name'],
    storeFields: ['name'],
  });

  let timeout;

  const onSearchInput = (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const value = e.target.value;
      const res = miniSearch.search(value, { prefix: true });
      setProviders(
        () => true,
        produce((provider) =>
          value != ''
            ? (provider.matchesQuery =
                res.map((o) => o.id).indexOf(provider.id) != -1)
            : (provider.matchesQuery = true)
        )
      );
    }, 500);
  };

  createEffect(() => {
    if (store.providers.state == 'ready') {
      setCount(store.providers().length);
      setProviders(
        store
          .providers()
          .map((o) => {
            return {
              name: o.sourceName,
              locationsCount: o.locationsCount,
              id: o.id,
              checked: true,
              matchesQuery: true,
              bbox: o.bbox,
            };
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1))
      );
      miniSearch.addAll(providers);
    }
  });

  function zoomToExtent() {
    const providerBounds = providers
      .filter((o) => o.checked)
      .map((o) => {
        return bbox(o.bbox);
      });
    let minLeft = 180;
    let minBottom = 90;
    let maxRight = -180;
    let maxTop = -90;
    providerBounds.forEach(([left, bottom, right, top]) => {
      if (left < minLeft) minLeft = left;
      if (bottom < minBottom) minBottom = bottom;
      if (right > maxRight) maxRight = right;
      if (top > maxTop) maxTop = top;
    });
    setViewport(null);
    setBounds([minLeft, minBottom, maxRight, maxTop]);
  }

  function onClickUpdate(providers) {
    setActiveProviders(providers);
    updateProviders(providers);
  }

  return (
    <article
      class={`card map-card ${store.providerListActive ? '' : ''}`}
    >
      <header class="map-card__header">
        <div style={{ display: 'flex' }}>
          <button
            class="close-btn"
            aria-label="close"
            onClick={() => toggleProviderList(false)}
          >
            <span class="material-symbols-outlined white clickable-icon">
              arrow_back
            </span>
          </button>
          <h3 class="map-card-title">Data Providers</h3>
        </div>
      </header>
      <div class="map-card__body">
        <section class="map-card-section">
          <div class="providers-list-subtitle">
            <button
              class="button-reset type-link-1 providers-list-select-all"
              onClick={() =>
                setProviders(() => true, 'checked', true)
              }
            >
              Select All
            </button>
            <span>|</span>
            <button
              class="button-reset type-link-1 providers-list-select-none"
              onClick={() => {
                setProviders(() => true, 'checked', false);
              }}
            >
              Select None
            </button>
          </div>
          <span>
            {providers.filter((o) => o.checked).length} providers
            selected
          </span>
          <Show
            when={
              activeProviders().length != count() &&
              activeProviders().length != 0
            }
          >
            <button
              style={{
                cursor: 'pointer',
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center',
              }}
              onClick={zoomToExtent}
            >
              <span>Zoom to provider extent </span>
              <span class="material-symbols-outlined">crop_free</span>
            </button>
          </Show>
        </section>
        <section class="map-card-section">
          <div>
            <input
              type="text"
              class="search-input"
              onInput={onSearchInput}
            />
            <span>
              {providers.filter((o) => o.matchesQuery).length ==
              count()
                ? `Listing all ${count()} providers`
                : `Listing ${
                    providers.filter((o) => o.matchesQuery).length
                  } of ${count()} providers`}
            </span>
          </div>
          <ul class="providers-list">
            <For each={providers.filter((o) => o.matchesQuery)}>
              {(provider) => {
                if (provider.matchesQuery) {
                  return (
                    <li class="providers-list__item">
                      <span class="provider-name">
                        {provider.name}
                      </span>
                      <input
                        type="checkbox"
                        name={`source-${provider.id}`}
                        id={`source-${provider.id}`}
                        class="checkbox"
                        value={provider.id}
                        checked={provider.checked}
                        onChange={(e) => {
                          setProviders(
                            (p) => p.id == provider.id,
                            'checked',
                            e.target.checked
                          );
                        }}
                      />
                    </li>
                  );
                }
              }}
            </For>
          </ul>
        </section>
      </div>
      <footer class="map-card__footer">
        <button
          class={`update-providers-btn btn btn-primary ${
            providers.filter((o) => o.checked).length > 0
              ? ''
              : 'btn-primary--disabled'
          }`}
          disabled={providers.filter((o) => o.checked).length == 0}
          onClick={() =>
            onClickUpdate(providers.filter((o) => o.checked))
          }
        >
          Update
        </button>
      </footer>
    </article>
  );
}
