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
    excludeProvider: (providers_id) => {
      setMapFilters(
        produce((mapFilters) => {
          mapFilters.excludedProviders.push(providers_id);
        })
      );
      console.log(mapFilters.excludedProviders);
    },
    includeProvider: (providers_id) => {
      setMapFilters(
        produce((mapFilters) => {
          mapFilters.excludedProviders.filter(
            (e) => e !== providers_id
          );
        })
      );
      console.log(mapFilters.excludedProviders);
    },
    excludeAllProviders: () => {
      setMapFilters({
        excludedProviders: [...state.providers().map((o) => o.id)],
        providers: [],
      });
    },
    includeAllProviders: () => {
      setMapFilters({
        excludedProviders: [],
        providers: [...state.providers()],
      });
    },
    updateProviders: () => {
      setMapFilters({
        providers: state.providers.filter((o) =>
          mapFilters.excludedProviders.include(o.id)
        ),
      });
    },
  });

  return mapFilters;
}
