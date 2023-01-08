import { createStore, produce } from 'solid-js/store';

export default function createMapFilters(
  client,
  actions,
  state,
  setState
) {
  const [mapFilters, setMapFilters] = createStore({
    monitor: true,
    airSensor: true,
    excludeInactive: false,
    excludedProviders: [],
  });
  Object.assign(actions, {
    toggleMonitor: (value) => {
      setMapFilters({ monitor: value });
    },
    toggleAirSensor: (value) => {
      setMapFilters({ airSensor: value });
    },
    toggleInactive: (value) => {
      setMapFilters({ excludeInactive: !value });
    },

    excludeProvider: (providers_id) => {
      setMapFilters(
        produce((mapFilters) => {
          mapFilters.excludedProviders.push(providers_id);
        })
      );
    },
  });

  return mapFilters;
}
