import { Show, createEffect, createSignal } from 'solid-js';
import style from './TabView.module.scss';
import { ListMap } from '../ListMap';
import { LocationList } from '../LocationList';
import { LocationDetailCardMini } from '../Cards/LocationDetailCardMini';
import { A } from '@solidjs/router';
import { useStore } from '../../stores';

interface TabViewDefintion {
  locations: any[];
  list: any;
}

export function TabView(props: TabViewDefintion) {
  const [activeTab, setActiveTab] = createSignal('list');
  const [parameters, setParameters] = createSignal([]);
  const [store, { setListParametersId, setListParameter }] = useStore();

  createEffect(() => {
    if (props.locations) {
      setParameters([
        ...new Set(
          ...props.locations.map((o) =>
            o.sensors.map((x) => x.parameter)
          )
        ),
      ]);
      if( parameters.length > 0) {
        setListParametersId(parameters()[0].id);
      }
    }
  });

  return (
    <div class={style['tab-view']}>
      <header class={style['tab-view__header']}>
        <nav class={style['tab-nav']}>
          <a href="#" onClick={() => setActiveTab('list')}>
            <div
              class={`${style['tab']} ${
                activeTab() == 'list' ? style['tab--active'] : ''
              }`}
            >
              <img
                src="/svgs/view_list_black.svg"
                class={`${style['tab-icon']} ${
                  activeTab() == 'list'
                    ? style['tab-icon--active']
                    : ''
                }`}
                alt=""
              />{' '}
              List
            </div>
          </a>
          <a href="#" onClick={() => setActiveTab('map')}>
            <div
              class={`${style['tab']} ${
                activeTab() == 'map' ? style['tab--active'] : ''
              }`}
            >
              <img
                src="/svgs/map_black.svg"
                class={`${style['tab-icon']} ${
                  activeTab() == 'map'
                    ? style['tab-icon--active']
                    : ''
                }`}
                alt="map icon"
              />
              Map
            </div>
          </a>
        </nav>
        <Show
          when={activeTab() == 'list' && props.locations.length > 0}
        >
          <div class={style['list-controls']}>
            <label for="parameter-select">Parameters</label>
            <select
              name="parameter-select"
              id=""
              class="select"
              value={store.listParametersId}
              onChange={(e) => {
                setListParametersId(e.target.value)
                setListParameter(e.target.options[e.target.selectedIndex].text)
              }
              }
            >
              <For each={parameters()}>
                {(parameter, i) => (
                  <option value={parameter.id}>
                    {parameter.display_name} {parameter.units}{' '}
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
