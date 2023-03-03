import { createStore } from 'solid-js/store';

export default function createMapFilters(client, actions, state) {
  const [mapFilters, setMapFilters] = createStore({
    monitor: true,
    airSensor: true,
    excludeInactive: true,
    providers: state.providers,
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
    updateProviders: (providersIds) => {
      setMapFilters({
        providers: providersIds,
      });
    },
  });

  return mapFilters;
}
