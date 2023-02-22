import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import createLocation from './createLocation';
import { Router } from '@solidjs/router';
import createClient from './createClient';
import createOverlay from './createOverlay';
import createViewport from './createViewport';
import createHelp from './createHelp';
import createParameter from './createParameter';
import createParameters from './createParameters';
import createProviders from './createProviders';
import createMeasurements from './createMeasurements';
import createMapFilters from './createMapFilters';
import createDownload from './createDownload';
import createRecentMeasurements from './createRecentMeasurements';
import createMapThreshold from './createMapThreshold';
import createDayTrends from './createDayTrends';
import createHourTrends from './createHourTrends';
import createMapBbox from './createMapBbox';

const StoreContext = createContext();

export function Provider(props) {
  let location = props.location;
  let overlay;
  let viewport;
  let measurements;
  let parameter;
  let parameters;
  let providers;
  let help;
  let mapFilters;
  let mapBbox;
  let download;
  let recentMeasurements;
  let mapThreshold;
  let dayTrends;
  let hourTrends;
  const [state, setState] = createStore({
    get location() {
      return location();
    },

    get overlay() {
      return overlay;
    },

    get measurements() {
      return measurements;
    },

    get recentMeasurements() {
      return recentMeasurements;
    },

    get parameter() {
      return parameter;
    },

    get parameters() {
      return parameters;
    },

    get providers() {
      return providers;
    },

    get download() {
      return download;
    },

    get dayTrends() {
      return dayTrends();
    },

    get hourTrends() {
      return hourTrends();
    },

    get mapFilters() {
      return mapFilters;
    },

    get mapThreshold() {
      return mapThreshold;
    },

    get mapBbox() {
      return mapBbox();
    },

    viewport: {
      zoom: 1.2,
      center: [40, 20],
    },

    providerListActive: false,

    get help() {
      return help;
    },
  });
  const actions = {};
  const store = [state, actions];
  const client = createClient(store);
  overlay = createOverlay(client, actions, state, setState);
  location = createLocation(client, actions, state, setState);
  viewport = createViewport(client, actions, state, setState);
  parameter = createParameter(client, actions, state, setState);
  help = createHelp(client, actions, state, setState);
  parameters = createParameters(client, actions, state, setState);
  providers = createProviders(client, actions, state, setState);
  measurements = createMeasurements(client, actions, state, setState);
  mapFilters = createMapFilters(client, actions, state, setState);
  download = createDownload(client, actions, state, setState);
  mapThreshold = createMapThreshold(client, actions, state, setState);
  dayTrends = createDayTrends(client, actions, state, setState);
  hourTrends = createHourTrends(client, actions, state, setState);
  mapBbox = createMapBbox(client, actions, state, setState);

  recentMeasurements = createRecentMeasurements(
    client,
    actions,
    state,
    setState
  );

  return (
    <Router>
      <StoreContext.Provider value={store}>
        {props.children}
      </StoreContext.Provider>
    </Router>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
