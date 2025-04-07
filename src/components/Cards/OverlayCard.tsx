import {
  NoRecentUpdateMarker,
  ReferenceGradeMarker,
  LowCostSensorMarker,
} from '../LocationMarker';
import { useStore } from '~/stores';
import FilterIcon from '~/assets/imgs/filter.svg';
import TuneIcon from '~/assets/imgs/tune.svg';
import '~/assets/scss/components/overlay-card.scss';
import AccessHelp from '../Help/AccessHelp';
import pollutantsContent from '~/content/help/pollutants.md?raw';
import { parseHelpMarkdown } from '../Cards/utils';
const parsedPollutantsContent = parseHelpMarkdown(pollutantsContent);
const parsedPollutantsHtml = parsedPollutantsContent.helpContent;
const parsedPollutantsTitle = parsedPollutantsContent.helpTitle;

export function OverlayCard() {
  const [
    store,
    {
      toggleShowProvidersCard,
      setSelectedMapParameter,
      toggleMapIsActive,
      toggleAirSensor,
      toggleMonitor,
    },
  ] = useStore();

  const svgAttributes = {
    width: 24,
    height: 24,
  };

  return (
    <div class="overlay-card">
      <section class="filter-section">
        <header class="filter-section__header">
          <div class="card-title">
            <FilterIcon {...svgAttributes} fill="#FFFFFF" />
            <h3>Filters</h3>
          </div>
        </header>
        <div class="pollutant-select">
          <div class="pollutant-label-wrapper">
            <label for="parameter-select" class="type-subtitle-2">
              Choose a pollutant{' '}
            </label>
            <span>
              <AccessHelp
                content={parsedPollutantsHtml}
                title={parsedPollutantsTitle}
              />
            </span>
          </div>

          <select
            class="select"
            name="parameter-select"
            id="parameter-select"
            onChange={(e) => setSelectedMapParameter(e.target.value)}
            value={store.mapParameter.toString()}
          >
            <option value="all">Any pollutant</option>
            <option value="pm25">PM&#8322;&#8325;</option>
            <option value="pm10">PM&#8321;&#8320;</option>
            <option value="o3">O&#8323;</option>
            <option value="no2">NO&#8322;</option>
            <option value="so2">SO&#8322;</option>
            <option value="co">CO</option>
          </select>
        </div>
        <hr class="hr" />
        <div>
          <span class="type-subtitle-2">Choose location type</span>

          <div class="filter-section__body">
            <ReferenceGradeMarker />
            <label class="marker-legend-item" for="reference-grade">
              <span>Reference monitor locations</span>
              <input
                type="checkbox"
                name="reference-grade"
                id="reference-grade"
                class="checkbox"
                checked={store.showMonitors}
                onInput={toggleMonitor}
                disabled={!store.showAirSensors}
              />
            </label>
            <LowCostSensorMarker />
            <label class="marker-legend-item" for="low-cost-sensor">
              Air sensors locations
              <input
                type="checkbox"
                name="low-cost-sensor"
                id="low-cost-sensor"
                class="checkbox"
                checked={store.showAirSensors}
                onInput={toggleAirSensor}
                disabled={!store.showMonitors}
              />
            </label>
            <NoRecentUpdateMarker />
            <label class="marker-legend-item" for="no-recent-updates">
              Show locations with no recent updates
              <input
                type="checkbox"
                name="no-recent-updates"
                id="no-recent-updates"
                class="checkbox"
                checked={!store.showOnlyActiveLocations}
                onInput={toggleMapIsActive}
              />
            </label>
          </div>
        </div>
      </section>
      <footer class="overlay-card__footer">
        <span class="type-body-1">
          Showing data from{' '}
          {store.providers.length == 0
            ? 'all providers'
            : store.providers.length == 1
              ? '1 provider'
              : `${store.providers.length} providers`}
        </span>
        <button
          class="icon-btn btn-secondary"
          onClick={() => toggleShowProvidersCard()}
        >
          Choose data providers <TuneIcon {...svgAttributes} fill="#33a3a1" />
        </button>
      </footer>
    </div>
  );
}
