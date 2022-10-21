import { useStore } from '../../stores';

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
        <div className="legend-section">
          <div>
            <span>PM 2.5 (µg/m³)</span>
            <span class="map-legend-title">
              Most recent measurements
            </span>
          </div>
          <div className="legend-bar">
            <div style="flex: 1; background-color: #DEDAFB;"></div>
            <div style="flex: 1; background-color: #CEC7FF;"></div>
            <div style="flex: 1; background-color: #BCB2FE;"></div>
            <div style="flex: 1; background-color: #A597FD;"></div>
            <div style="flex: 1; background-color: #8576ED;"></div>
            <div style="flex: 1; background-color: #7867EB;"></div>
            <div style="flex: 1; background-color: #6A5CD8;"></div>
            <div style="flex: 1; background-color: #584DAE;"></div>
            <div style="flex: 1; background-color: #241050;"></div>
          </div>
          <div className="legend-bar-labels">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
        <div className="legend-help-section">
          <span
            class="material-symbols-outlined icon"
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
