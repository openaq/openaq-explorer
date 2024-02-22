import { useStore } from '~/stores';

import style from './ProvidersCard.module.scss';
import { For, Show, createEffect, createSignal, onMount } from 'solid-js';
import { getProviders } from '~/client';
import MiniSearch from 'minisearch';
import bbox from '@turf/bbox';
import { createStore, produce } from 'solid-js/store';

interface ProvidersStoreDefinition {
  name: string;
  locationsCount: number;
  id: number;
  checked: boolean;
  matchesQuery: boolean;
  bbox: number[];
}

export function ProvidersCard() {
  const [store, { toggleShowProvidersCard, setViewport, setProviders,setTotalProviders }] =
    useStore();

  const [count, setCount] = createSignal();
  // const [totalProviders, setTotalProviders] = createSignal();
  const [selectedProviders, setSelectedProviders] = createStore<
    ProvidersStoreDefinition[]
  >([]);
  const [activeProviders, setActiveProviders] = createSignal([]);

  const onClickClose = () => {
    toggleShowProvidersCard();
  };

  const miniSearch = new MiniSearch({
    fields: ['name'],
    storeFields: ['name'],
  });

  let timeout: ReturnType<typeof setTimeout>;

  const onSearchInput = (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const value = e.target.value;
      const res = miniSearch.search(value, { prefix: true });
      setSelectedProviders(
        () => true,
        produce((provider) =>
          value != ''
            ? (provider.matchesQuery =
                res.map((o) => o.id).indexOf(provider.id) != -1)
            : (provider.matchesQuery = true)
        )
      );
    }, 300);
  };

  onMount(async () => {
    const data = await getProviders();
    const results = data.results;
    setCount(results.length);
    setTotalProviders(results.length)
    setSelectedProviders(
      results
        .map((o) => {
          return {
            name: o.name,
            id: o.id,
            checked: true,
            matchesQuery: true,
            bbox: o.bbox,
          };
        })
        .sort((a, b) => (a.name < b.name ? -1 : 1))
    );
    miniSearch.addAll(selectedProviders);
  });

  function zoomToExtent() {
    const providerBounds = selectedProviders
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

  function onClickUpdate(selectedProviders:any) {
    setActiveProviders(selectedProviders);
    setProviders(selectedProviders.length === store.totalProviders ? [] : selectedProviders.map(o => o.id))
  }

  return (
    <div class={style['providers-card']}>
      <header class={style['providers-card__header']}>
        <img
          src="/svgs/arrow_left_white.svg"
          alt=""
          onClick={() => onClickClose()}
        />
        <h3 class="type-heading-3 text-white">Data providers</h3>
      </header>
      <div class={style['providers-card__body']}>
        <div class={style['select-helpers']}>
        <button
              class="button-reset type-link-1 providers-list-select-all"
              onClick={() =>
                setSelectedProviders(() => true, 'checked', true)
              }
            >
              Select All
            </button>
            <span>|</span>
            <button
              class="button-reset type-link-1 providers-list-select-none"
              onClick={() => {
                setSelectedProviders(() => true, 'checked', false);
              }}
            >
              Select None
            </button>
        </div>
        <span>
            {selectedProviders.filter((o) => o.checked).length} providers
            selected
          </span>
          <Show
            when={
              activeProviders().length != count() &&
              activeProviders().length != 0
            }
          >
            <button
              class="button-reset zoom-to-provider-btn"
              onClick={zoomToExtent}
            >
              <span>Zoom to provider extent </span>
              <img src="/svgs/crop_free_smoke120.svg" alt="" />
            </button>
          </Show>
        <input
          type="text"
          name="search-input"
          id="search-input"
          class={style['search-input']}
          onInput={(e) => onSearchInput(e)}
        />
        <span>
          {selectedProviders.filter((o) => o.matchesQuery).length == count()
            ? `Listing all ${count()} providers`
            : `Listing ${
                selectedProviders.filter((o) => o.matchesQuery).length
              } of ${count()} providers`}
        </span>
        <ul class={style['providers-list']}>
          <For each={selectedProviders.filter((o) => o.matchesQuery)}>
            {(provider, i) => {
              if (provider.matchesQuery) {
                return (
                  <li class={style['providers-list-item']}>
                    <label
                      for={`${provider.name}-checkbox`}
                      class="type-body-1 text-smoke-120"
                    >
                      {provider.name}
                    </label>
                    <input
                      type="checkbox"
                      name={`${provider.name}-checkbox`}
                      id={`${provider.name}-checkbox`}
                      value={provider.id}
                      checked={provider.checked}
                      class="checkbox"
                      onChange={(e) => {
                        setSelectedProviders(
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
      </div>
      <footer class={style['providers-card__footer']}>
      <button 
      class={`btn btn-primary ${
        selectedProviders.filter((o) => o.checked).length > 0
              ? ''
              : 'btn-primary--disabled'
          }`}
          disabled={selectedProviders.filter((o) => o.checked).length == 0}
          onClick={() =>
            onClickUpdate(selectedProviders.filter((o) => o.checked))
          }
        >Update</button>
      </footer>
    </div>
  );
}
