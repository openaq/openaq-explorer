import { For, Show, createEffect, createSignal } from 'solid-js';
import { ListMap } from '~/components/ListMap';
import { LocationList } from '~/components/LocationList';
import { LocationDetailCardMini } from '~/components/Cards/LocationDetailCardMini';
import { useStore } from '~/stores';
import MapIcon from '~/assets/imgs/map.svg';
import ViewListIcon from '~/assets/imgs/view_list.svg';

import '~/assets/scss/components/tab-view.scss';
import { ListItemDefinition, ParameterDefinition } from '~/db/types';

interface TabViewDefintion {
  locations: ListItemDefinition[];
  list: any;
}

export function TabView(props: TabViewDefintion) {
  const svgAttributes = {
    width: 24,
    height: 24,
  };

  const [activeTab, setActiveTab] = createSignal('list');
  const [parameters, setParameters] = createSignal<ParameterDefinition[]>([]);
  const [store, { setListParametersId, setListParameter }] = useStore();

  createEffect(() => {
    if (props.locations) {
      setParameters([
        ...new Set(
          ...props.locations.map((o) => o.sensors.map((x) => x.parameter))
        ),
      ]);
      if (parameters.length > 0) {
        setListParametersId(parameters()[0].id);
      }
    }
  });

  return (
    <div class="tab-view">
      <header class="tab-view__header">
        <nav class="tab-nav">
          <a href="#" onClick={() => setActiveTab('list')}>
            <div class={`tab ${activeTab() == 'list' ? 'tab--active' : ''}`}>
              {''}
              <ViewListIcon
                {...svgAttributes}
                class={`tab-icon ${
                  activeTab() == 'list' ? 'tab-icon--active' : ''
                }`}
              />
              List
            </div>
          </a>
          <a href="#" onClick={() => setActiveTab('map')}>
            <div class={`tab ${activeTab() == 'map' ? 'tab--active' : ''}`}>
              <MapIcon
                {...svgAttributes}
                class={`$'tab-icon' ${
                  activeTab() == 'map' ? 'tab-icon--active' : ''
                }`}
              />
              Map
            </div>
          </a>
        </nav>
        <Show when={activeTab() == 'list' && props.locations.length > 0}>
          <div class="list-controls">
            <label for="parameter-select">Parameters</label>
            <select
              name="parameter-select"
              id=""
              class="select"
              value={store.listParametersId}
              onChange={(e) => {
                setListParametersId(Number(e.target.value));
                setListParameter(e.target.options[e.target.selectedIndex].text);
              }}
            >
              <For each={parameters()}>
                {(parameter) => (
                  <option value={parameter.id}>
                    {parameter.displayName} {parameter.units}{' '}
                  </option>
                )}
              </For>
            </select>
          </div>
        </Show>
      </header>
      <section>
        <Show when={activeTab() == 'list'}>
          <div id="list-view">
            <LocationList {...props} />
          </div>
        </Show>
        <Show when={activeTab() == 'map'}>
          <div id="map-view">
            <ListMap {...props} />
            <LocationDetailCardMini />
          </div>
        </Show>
      </section>
    </div>
  );
}
