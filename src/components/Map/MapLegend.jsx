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

  return (
    <div className="map-legend">
      <div className="map-legend__body">
        <div className="map-legend-section">
          <div className="map-legend-title">
            <span className="type-subtitle-3 text-smoke-120">
              {store.parameter.parameterName} ({store.parameter.unit})
            </span>
            <span className="type-subtitle-3 text-smoke-60">
              {legendTitle}
            </span>
          </div>
          <div className="map-legend-bar">
            <For each={colors()}>
              {(value, i) => (
                <div
                  style={`flex: 1; background-color: ${value};`}
                ></div>
              )}
            </For>
          </div>
          <div
            className="map-legend-bar-labels"
            style="display:flex; margin:0;"
          >
            {store.mapThreshold.active ? (
              <For each={percentBins}>
                {(value, i) => (
                  <span className="type-body-4" style="flex:1;">
                    {value}
                  </span>
                )}
              </For>
            ) : (
              <For each={parametersBins[store.parameter.id]}>
                {(value, i) => (
                  <span className="type-body-4" style="flex:1;">
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
        <div className="legend-help-section">
          <span
            class="legend-help material-symbols-outlined clickable-icon"
            onClick={(e) => showHelp(e)}
          >
            help
          </span>
          <span>Help</span>
        </div>
      </div>
    </div>
  );
}
