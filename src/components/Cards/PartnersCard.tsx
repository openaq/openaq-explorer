import { useStore } from '~/stores';

import { For, Show, createEffect, createSignal, onMount } from 'solid-js';
import { getPartnerProjects, getGroupLocations } from '~/client';
import bbox from '@turf/bbox';
import { createStore } from 'solid-js/store';
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

interface PartnerProjectStoreDefinition {
  name: string;
  id: number;
  checked: boolean;
}

export function PartnersCard() {
  const [
    store,
    {
      toggleShowPartnersCard,
      setViewport,
      setBounds,
      toggleIsFlipped,
      setGroupLocationsIds,
      setGroups,
    },
  ] = useStore();

  const [count, setCount] = createSignal();
  const [partnerProjects, setPartnerProjects] = createStore<PartnerProjectStoreDefinition[]>([]);

  const [activePartnerProjects, setActivePartnerProjects] = createSignal([]);

  const onClickClose = () => {
    toggleIsFlipped();
    setTimeout(() => {
      toggleShowPartnersCard();
    }, 600);
  };

    createEffect(() => {
      setActivePartnerProjects(partnerProjects.filter((p) => p.checked));
    });


  const svgAttributes = {
    width: 24,
    height: 24,
  };


  onMount(async () => {
    const data = await getPartnerProjects();
    const results = data.results;
    setCount(results.length);

    const groups = store.groups;

    setPartnerProjects(
      results.map(o => {
       const isSelected = groups.includes(o.id);

        return {
          ...o,
          checked: isSelected
        }
      })
    )
  });

  function zoomToExtent() {
    const projectBounds = partnerProjects
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

  async function onClickUpdate(activePartnerProjects: PartnerProjectStoreDefinition[]) {
    const selectedIds = activePartnerProjects.map((p) => p.id);
    setGroups(selectedIds);
    let locationIds = new Set<number>([]);

    for (const groupsId of selectedIds) {
      const locationsIds = await getGroupLocations(groupsId);
      locationIds.add(locationsIds[0].sensorNodesIds)
    }
    setGroupLocationsIds(...locationIds);
  }

  async function onClickReset() {
    setGroups([]);
    setGroupLocationsIds([]);

    setPartnerProjects(
      partnerProjects.map((o) => {
      
        return {
          ...o,
          checked: false
        }
      })
    )
  }

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
              onClick={() => setPartnerProjects(() => true, 'checked', true)}
              tabindex={`${store.showHelpCard ? '-1' : '0'}`}
            >
              Select All
            </button>
            <span>|</span>
            <button
              class="button-reset type-link-1 projects-list-select-none"
              onClick={() => {
                setPartnerProjects(() => true, 'checked', false);
              }}
              tabindex={`${store.showHelpCard ? '-1' : '0'}`}
            >
              Select None
            </button>
          </div>
          
          <span>
            {activePartnerProjects().length} of {`${count()}`} projects selected
          </span>
          <Show
            when={
              activePartnerProjects().length != count() &&
              activePartnerProjects().length != 0
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
          
          <span>
            {partnerProjects.filter((o) => o.checked).length == count()
              ? `Listing all ${count()} projects`
              : `Listing ${
                  partnerProjects.filter((o) => o.checked).length
                } of ${count()} projects`}
          </span>
        </div>
        <div 
          class="list-container"
          tabindex={`${store.showHelpCard ? '-1' : '0'}`}
        >
          <ul class="projects-list">
            <For each={partnerProjects}>
              {(project, i) => {
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
                          setPartnerProjects(
                            (p) => p.id == project.id,
                            'checked',
                            e.target.checked
                          );
                        }}
                        tabindex={`${store.showHelpCard ? '-1' : '0'}`}
                      />
                    </li>
                  );
              }}
            </For>
          </ul>
        </div>
      </div>
      <footer class="projects-card__footer">
        <button
          class={`btn btn-primary ${
            partnerProjects.filter(o => o.checked).length > 0 ? '' : 'btn-primary--disabled'
          }`}
          disabled={partnerProjects.filter(o => o.checked).length === 0}  
          onClick={async () => await onClickUpdate(activePartnerProjects())}
          tabindex={`${store.showHelpCard ? '-1' : '0'}`}
        >
          Update
        </button>
        <button
          class="btn btn-secondary"
          onClick={async () => await onClickReset()}
          tabindex={`${store.showHelpCard ? '-1' : '0'}`}
        >
          Reset
        </button>
      </footer>
    </div>
  );
}
