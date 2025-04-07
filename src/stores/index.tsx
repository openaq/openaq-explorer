import { createContext, useContext, Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Viewport } from 'solid-map-gl';

interface StoreParameters {
  locationsId: number | undefined;
  mapParameter: string;
  listsId: number | undefined;
  listLocationsId: number | undefined;
  listParametersId: number | undefined;
  listParameter: string | undefined;
  deleteListModalOpen: boolean;
  deleteListLocationModalOpen: boolean;
  newListModalOpen: boolean;
  editListModalOpen: boolean;
  deleteLocationModalOpen: boolean;
  showProvidersCard: boolean;
  viewport: Viewport;
  showAirSensors: boolean;
  showMonitors: boolean;
  showOnlyActiveLocations: boolean;
  totalProviders: number;
  providers: any[];
  recentMeasurements: any[];
  toastOpen: boolean;
  apiKeyRegenerateModalOpen: boolean;
  passwordChangeModalOpen: boolean;
  bounds: number[];
  mapBbox: number[];
  showNotificationCard: boolean;
  showHelpCard: boolean;
  helpContent: string;
}

type Store = [
  StoreParameters,
  {
    setSelectedLocationsId: (locationsId: number) => void;
    clearLocationsId: () => void;
    setSelectedMapParameter: (mapParameter: string) => void;
    setDeleteListsId: () => void;
    setDeleteListLocationsId: () => void;
    setListParametersId: (parametersId: number) => void;
    setListParameter: (parameter: string) => void;
    clearDeleteListsId: () => void;
    toggleDeleteListModalOpen: () => void;
    toggleNewListModalOpen: () => void;
    toggleEditListModalOpen: () => void;
    toggleShowProvidersCard: () => void;
    toggleRegenerateKeyModalOpen: () => void;
    toggleDeleteListLocationModalOpen: () => void;
    setViewport: (viewport: Viewport) => void;
    toggleMonitor: () => void;
    toggleAirSensor: () => void;
    toggleMapIsActive: () => void;
    setProviders: (providers: any[]) => void;
    setRecentMeasurements: () => void;
    addRecentMeasurements: () => void;
    updateRecentMeasurements: (parameter: string, measurements) => void;
    setTotalProviders: () => void;
    openToast: () => void;
    setBounds: (bounds: number[]) => void;
    setMapBbox: (mapBbox: number[]) => void;
    toggleShowNotificationCard: (value: boolean) => void;
    toggleShowHelpCard: (value: boolean) => void;
    setHelpContent: (content: string) => void;
  },
];

const StoreContext = createContext<Store>();

export const StoreProvider: Component<{}> = (props) => {
  const [state, setState] = createStore({
    locationsId: undefined,
    mapParameter: 'all',
    listsId: undefined,
    listLocationsId: undefined,
    newListModalOpen: false,
    deleteListModalOpen: false,
    deleteLocationModalOpen: false,
    deleteListLocationModalOpen: false,
    editListModalOpen: false,
    showProvidersCard: false,
    viewport: {
      zoom: 1.2,
      center: [40, 20],
    },
    showOnlyActiveLocations: true,
    showAirSensors: true,
    showMonitors: true,
    totalProviders: 0,
    providers: [],
    recentMeasurements: [],
    toastOpen: false,
    apiKeyRegenerateModalOpen: false,
    listParametersId: undefined,
    bounds: [],
    mapBbox: [],
    showNotificationCard: false,
    showHelpCard: false,
    helpContent: '',
  });

  const store = [
    state,
    {
      setSelectedLocationsId(locationsId: number) {
        setState({ locationsId: locationsId });
      },
      setBounds(bounds: number[]) {
        setState({ bounds: bounds });
      },
      setMapBbox(mapBbox: number[]) {
        setState({ mapBbox: mapBbox });
      },
      clearLocationsId() {
        setState({ locationsId: undefined });
      },
      setSelectedMapParameter(parameter: string) {
        setState({ mapParameter: parameter });
      },
      setDeleteListsId(listsId: number) {
        setState({ listsId: listsId });
      },
      clearDeleteListsId() {
        setState({ listsId: undefined });
      },
      toggleDeleteListModalOpen() {
        setState({ deleteListModalOpen: !state.deleteListModalOpen });
      },
      toggleNewListModalOpen() {
        setState({ newListModalOpen: !state.newListModalOpen });
      },
      toggleEditListModalOpen() {
        setState({ editListModalOpen: !state.editListModalOpen });
      },
      toggleShowProvidersCard() {
        setState({ showProvidersCard: !state.showProvidersCard });
      },
      setViewport(viewport: Viewport) {
        setState({ viewport: viewport });
      },
      toggleMonitor() {
        setState({ showMonitors: !state.showMonitors });
      },
      toggleAirSensor() {
        setState({ showAirSensors: !state.showAirSensors });
      },
      toggleMapIsActive() {
        setState({
          showOnlyActiveLocations: !state.showOnlyActiveLocations,
        });
      },
      setProviders(providers) {
        setState({ providers: providers });
      },
      setTotalProviders(totalProviders: number) {
        setState({ totalProviders: totalProviders });
      },
      setRecentMeasurements(measurements) {
        setState({ recentMeasurements: measurements });
      },
      addRecentMeasurements(measurements) {
        setState('recentMeasurements', (prevList) => [
          ...prevList,
          measurements,
        ]);
      },
      updateRecentMeasurements(parameter: string, measurements) {
        const idx = state.recentMeasurements.findIndex(
          (p) => p.parameter == parameter
        );
        const p = state.recentMeasurements[idx];
        p.setLoading(false);
        p.setSeries(measurements.series);
      },
      openToast() {
        setState({ toastOpen: true });
        setTimeout(() => setState({ toastOpen: false }), 5000);
      },
      toggleRegenerateKeyModalOpen() {
        setState({
          apiKeyRegenerateModalOpen: !state.apiKeyRegenerateModalOpen,
        });
      },
      toggleDeleteListLocationModalOpen() {
        setState({
          deleteListLocationModalOpen: !state.deleteListLocationModalOpen,
        });
      },
      setDeleteListLocationsId(listLocationsId: number) {
        setState({ listLocationsId: listLocationsId });
      },
      setListParametersId(parametersId: number) {
        setState({ listParametersId: parametersId });
      },
      setListParameter(parameter: string) {
        setState({ listParameter: parameter });
      },
      toggleShowNotificationCard(value: boolean) {
        setState({ showNotificationCard: value });
      },
      toggleShowHelpCard(value: boolean) {
        setState({ showHelpCard: value });
      },
      setHelpContent(content: string) {
        setState({ helpContent: content });
      },
    },
  ];

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext: cannot find a StoreContext');
  }
  return context;
}

export function useStore(): Store {
  return useStoreContext();
}
