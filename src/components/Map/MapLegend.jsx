import { useStore } from '../../stores';
import { parametersBins } from '.';
export default function MapLegend() {
  const [store, { toggleHelp, loadContent }] = useStore();

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
              Most recent measurements
            </span>
          </div>
          <div className="map-legend-bar">
            <div style="flex: 1; background-color: #CEC7FF;"></div>
            <div style="flex: 1; background-color: #A497FD;"></div>
            <div style="flex: 1; background-color: #8F81EE;"></div>
            <div style="flex: 1; background-color: #7867EB;"></div>
            <div style="flex: 1; background-color: #6A5CD8;"></div>
            <div style="flex: 1; background-color: #584DAE;"></div>
            <div style="flex: 1; background-color: #241050;"></div>
          </div>
          <div
            className="map-legend-bar-labels"
            style="display:flex; margin:0;"
          >
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
