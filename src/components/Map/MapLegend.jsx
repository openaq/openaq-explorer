import { createEffect, For } from 'solid-js';
import { useStore } from '../../stores';
import {
  parametersBins,
  percentBins,
  percentHexValues,
  hexValues,
} from '.';
export default function MapLegend() {
  const [store, { toggleHelp, loadContent }] = useStore();

  const legendTitle = () =>
    store.mapThreshold.active
      ? '% Measurements exceeding threshold'
      : 'Most recent measurements';

  const colors = () =>
    store.mapThreshold.active ? percentHexValues : hexValues;

  const showHelp = (e) => {
    toggleHelp(true);
    loadContent('legend');
    e.stopPropagation();
  };

  createEffect(() => console.log(store.parameter));

  return (
    <div class="map-legend">
      <div class="map-legend__body">
        <div class="map-legend-section">
          <div class="map-legend-title">
            <span class="type-subtitle-3 text-smoke-120">
              {store.parameter.parameterName} ({store.parameter.unit})
            </span>
            <span class="type-subtitle-3 text-smoke-60">
              {legendTitle}
            </span>
          </div>
          <div class="map-legend-bar">
            <For each={colors()}>
              {(value) => (
                <div style={`flex: 1; background-color: ${value};`} />
              )}
            </For>
          </div>
          <div
            class="map-legend-bar-labels"
            style={{ display: 'flex', margin: '0' }}
          >
            {store.mapThreshold.active ? (
              <For each={percentBins}>
                {(value) => (
                  <span class="type-body-4" style={{ flex: '1' }}>
                    {value}
                  </span>
                )}
              </For>
            ) : (
              <For each={parametersBins[store.parameter.id]}>
                {(value, i) => (
                  <span class="type-body-4" style={{ flex: '1' }}>
                    {value}
                    {i() + 1 ==
                    parametersBins[store.parameter.id].length
                      ? '+'
                      : ''}
                  </span>
                )}
              </For>
            )}
          </div>
        </div>
        <div class="legend-help-section">
          <button onClick={(e) => showHelp(e)} class="button-reset">
            <span class="legend-help material-symbols-outlined clickable-icon">
              help
            </span>
            <span>Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}
