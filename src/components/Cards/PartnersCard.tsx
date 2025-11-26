import { useStore } from '~/stores';

import { For, Show, createSignal, onMount, createEffect } from 'solid-js';
import { getPartnerProjectById } from '~/client';
import MiniSearch from 'minisearch';
import bbox from '@turf/bbox';
import { createStore, produce } from 'solid-js/store';
import ArrowLeftIcon from '~/assets/imgs/arrow_left.svg';
import CropIcon from '~/assets/imgs/crop.svg';

import '~/assets/scss/components/projects-card.scss';

interface PartnersStoreDefinition {
  name: string;
  locationsCount: number;
  id: number;
  checked: boolean;
  matchesQuery: boolean;
  bbox: number[];
}

export function PartnersCard() {
  const [
    store,
    {
      toggleShowPartnersCard,
      setViewport,
      setProviders,
      setTotalProviders,
      setBounds,
      setMapBbox,
      toggleIsFlipped,
      setGroupLocationsIds,
      setTotalGroupLocationsIds,
    },
  ] = useStore();

  const [count, setCount] = createSignal();

  const [selectedProjects, setSelectedProjects] = createStore<
    PartnersStoreDefinition[]
  >([]);
  const [activeProjects, setActiveProjects] = createSignal([]);

  const onClickClose = () => {
    toggleIsFlipped();
    setTimeout(() => {
      toggleShowPartnersCard();
    }, 600);
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
      setSelectedProjects(
        () => true,
        produce((project) =>
          value != ''
            ? (project.matchesQuery =
                res.map((o) => o.id).indexOf(project.id) != -1)
            : (project.matchesQuery = true)
        )
      );
    }, 300);
  };

  onMount(async () => {
    const data = await getPartnerProjectById(partnerProject);
    const results = data.results;
    setCount(results.length);
    setTotalGroupLocationsIds(results.length);
    setSelectedProjects(
      results
        .map((o) => {
          return {
            name: o.name,
            id: o.id,
            checked:
              store.groupLocationsIds.length === 0
                ? 'true'
                : store.groupLocationsIds.includes(o.id),
            matchesQuery: true,
            bbox: o.bbox,
          };
        })
        .sort((a, b) => (a.name.toLowerCase < b.name.toLowerCase ? -1 : 1))
    );
    miniSearch.addAll(selectedProjects);
  });

  createEffect(() => {
    setActiveProjects(selectedProjects.filter((p) => p.checked));
  });

  function zoomToExtent() {
    const projectBounds = selectedProjects
      .filter((o) => o.checked)
      .map((o) => bbox(o.bbox));

    let minLeft = 180;
    let minBottom = 90;
    let maxRight = -180;
    let maxTop = -90;

    projectBounds.forEach(([left, bottom, right, top]) => {
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

  function onClickUpdate(selectedProjects: PartnersStoreDefinition[]) {
    const selectedIds = selectedProjects.map((p) => p.id);
    setGroupLocationsIds(
      selectedIds.length === store.totalGroupLocationsIds ? [] : selectedIds
    );
    console.log(store.groupLocationsIds);
    console.log(selectedProjects);
    console.log(activeProjects());
  }

  const partnerProject: number = 66;

  return (
    <div class="projects-card">
      <header class="projects-card__header">
        <button 
          class="button-reset" 
          aria-label="Go back"
          onClick={() => onClickClose()}
          tabindex={`${store.showHelpCard ? '-1' : '0'}`}
        >
          <ArrowLeftIcon
            fill="#FFFFFF"
            {...svgAttributes}
            aria-hidden="true"
          />
        </button>
        <h2 class="type-heading-3 text-white">Partner projects (Beta)</h2>
      </header>
      <div class="projects-card__body">
        <div class="list-header">
          <div class="select-helpers">
            <button
              class="button-reset type-link-1 projects-list-select-all"
              onClick={() => setSelectedProjects(() => true, 'checked', true)}
              tabindex={`${store.showHelpCard ? '-1' : '0'}`}
            >
              Select All
            </button>
            <span>|</span>
            <button
              class="button-reset type-link-1 projects-list-select-none"
              onClick={() => {
                setSelectedProjects(() => true, 'checked', false);
              }}
              tabindex={`${store.showHelpCard ? '-1' : '0'}`}
            >
              Select None
            </button>
          </div>
          <span>
            {activeProjects().length} of {`${count()}`} projects selected
          </span>
          <Show
            when={
              activeProjects().length != count() &&
              activeProjects().length != 0
            }
          >
            <button
              class="button-reset zoom-to-project-btn"
              onClick={zoomToExtent}
              tabindex={`${store.showHelpCard ? '-1' : '0'}`}
            >
              <span>Zoom to project extent </span>
              <CropIcon fill="#5a6672" {...svgAttributes} aria-hidden="true" />
            </button>
          </Show>
          <label for="search-input">Search projects</label>
          <input
            type="text"
            name="search-input"
            id="search-input"
            class="search-input"
            onInput={(e) => onSearchInput(e)}
            tabindex={`${store.showHelpCard ? '-1' : '0'}`}
          />
          <span>
            {selectedProjects.filter((o) => o.matchesQuery).length == count()
              ? `Listing all ${count()} projects`
              : `Listing ${
                  selectedProjects.filter((o) => o.matchesQuery).length
                } of ${count()} projects`}
          </span>
        </div>
        <div 
          class="list-container"
          tabindex={`${store.showHelpCard ? '-1' : '0'}`}
        >
          <ul class="projects-list">
            <For each={selectedProjects.filter((o) => o.matchesQuery)}>
              {(project, i) => {
                if (project.matchesQuery) {
                  return (
                    <li class="projects-list-item">
                      <label
                        for={`${project.name}-checkbox`}
                        class="type-body-1 text-smoke-120"
                      >
                        {project.name}
                      </label>
                      <input
                        type="checkbox"
                        name={`${project.name}-checkbox`}
                        id={`${project.name}-checkbox`}
                        value={project.id}
                        checked={project.checked}
                        class="checkbox"
                        onChange={(e) => {
                          setSelectedProjects(
                            (p) => p.id == project.id,
                            'checked',
                            e.target.checked
                          );
                        }}
                        tabindex={`${store.showHelpCard ? '-1' : '0'}`}
                      />
                    </li>
                  );
                }
              }}
            </For>
          </ul>
        </div>
      </div>
      <footer class="projects-card__footer">
        <button
          class={`btn btn-primary ${
            activeProjects().length > 0 ? '' : 'btn-primary--disabled'
          }`}
          disabled={activeProjects().length === 0}
          onClick={() => onClickUpdate(activeProjects())}
          tabindex={`${store.showHelpCard ? '-1' : '0'}`}
        >
          Update
        </button>
      </footer>
    </div>
  );
}
