import { useStore } from '~/stores';

import { For, Show, createSignal, onMount, createEffect } from 'solid-js';
import { getProviders } from '~/client';
import MiniSearch from 'minisearch';
import bbox from '@turf/bbox';
import { createStore, produce } from 'solid-js/store';
import ArrowLeftIcon from '~/assets/imgs/arrow_left.svg';
import CropIcon from '~/assets/imgs/crop.svg';

import '~/assets/scss/components/providers-card.scss';

interface ProvidersStoreDefinition {
  name: string;
  locationsCount: number;
  id: number;
  checked: boolean;
  matchesQuery: boolean;
  bbox: number[];
}

export function ProvidersCard() {
  const [
    store,
    {
      toggleShowProvidersCard,
      setViewport,
      setProviders,
      setTotalProviders,
      setBounds,
      setMapBbox,
    },
  ] = useStore();

  const [count, setCount] = createSignal();

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

  const svgAttributes = {
    width: 24,
    height: 24,
  };

  let timeout: ReturnType<typeof setTimeout>;

  const onSearchInput = (e: InputEvent) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
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
    setTotalProviders(results.length);
    setSelectedProviders(
      results
        .map((o) => {
          return {
            name: o.name,
            id: o.id,
            checked:
              store.providers.length === 0
                ? 'true'
                : store.providers.includes(o.id),
            matchesQuery: true,
            bbox: o.bbox,
          };
        })
        .sort((a, b) => (a.name.toLowerCase < b.name.toLowerCase ? -1 : 1))
    );
    miniSearch.addAll(selectedProviders);
  });

  createEffect(() => {
    setActiveProviders(selectedProviders.filter((p) => p.checked));
  });

  function zoomToExtent() {
    const providerBounds = selectedProviders
      .filter((o) => o.checked)
      .map((o) => bbox(o.bbox));

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

    setBounds([minLeft, minBottom, maxRight, maxTop]);
    setViewport({
      zoom: 11,
      center: [(minLeft + maxRight) / 2, (minBottom + maxTop) / 2],
    });
  }

  function onClickUpdate(selectedProviders: ProvidersStoreDefinition[]) {
    const selectedIds = selectedProviders.map((p) => p.id);
    setProviders(
      selectedIds.length === store.totalProviders ? [] : selectedIds
    );
  }

  return (
    <div class="providers-card">
      <header class="providers-card__header">
        <ArrowLeftIcon
          fill="#FFFFFF"
          {...svgAttributes}
          onClick={() => onClickClose()}
        />
        <h3 class="type-heading-3 text-white">Data providers</h3>
      </header>
      <div class="providers-card__body">
        <div class="list-header">
          <div class="select-helpers">
            <button
              class="button-reset type-link-1 providers-list-select-all"
              onClick={() => setSelectedProviders(() => true, 'checked', true)}
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
            {activeProviders().length} of {`${count()}`} providers selected
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
              <CropIcon fill="#5a6672" {...svgAttributes} />
            </button>
          </Show>
          <input
            type="text"
            name="search-input"
            id="search-input"
            class="search-input"
            onInput={(e) => onSearchInput(e)}
          />
          <span>
            {selectedProviders.filter((o) => o.matchesQuery).length == count()
              ? `Listing all ${count()} providers`
              : `Listing ${
                  selectedProviders.filter((o) => o.matchesQuery).length
                } of ${count()} providers`}
          </span>
        </div>
        <div class="list-container">
          <ul class="providers-list">
            <For each={selectedProviders.filter((o) => o.matchesQuery)}>
              {(provider, i) => {
                if (provider.matchesQuery) {
                  return (
                    <li class="providers-list-item">
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
      </div>
      <footer class="providers-card__footer">
        <button
          class={`btn btn-primary ${
            activeProviders().length > 0 ? '' : 'btn-primary--disabled'
          }`}
          disabled={activeProviders().length === 0}
          onClick={() => onClickUpdate(activeProviders())}
        >
          Update
        </button>
      </footer>
    </div>
  );
}
