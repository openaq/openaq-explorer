import { createContext, useContext, Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Viewport } from 'solid-map-gl';

type Store = [
  {
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
    viewport: Viewport | undefined;
    showAirSensors: boolean;
    showMonitors: boolean;
    showOnlyActiveLocations: boolean;
    totalProviders: number;
    providers: any[];
    recentMeasurements: any[];
    toastOpen: boolean;
    apiKeyRegenerateModalOpen: boolean;
  },
  {
    setSelectedLocationsId: () => void;
    clearLocationsId?: () => void;
    setSelectedMapParameter?: () => void;
    setDeleteListsId?: () => void;
    setDeleteListLocationsId? : () => void;


    setListParametersId? : () => void;
    setListParameter? : () => void;

    clearDeleteListsId?: () => void;
    toggleDeleteListModalOpen?: () => void;
    toggleNewListModalOpen?: () => void;
    toggleEditListModalOpen?: () => void;
    toggleShowProvidersCard?: () => void;
    toggleRegenerateKeyModalOpen?: () => void;
    toggleDeleteListLocationModalOpen? : () => void;
    setViewport?: () => void;
    toggleMonitor?: () => void;
    toggleAirSensor?: () => void;
    toggleMapIsActive?: () => void;
    setProviders?: () => void;
    setRecentMeasurements?: () => void;
    addRecentMeasurements?: () => void;
    updateRecentMeasurements?: () => void;
    setTotalProviders?: () => void;
    openToast?: () => void;

  }
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
  });

  const store = [
    state,
    {
      setSelectedLocationsId(locationsId: number) {
        setState({ locationsId: locationsId });
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
      toggleShowOnlyActiveLocations() {
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
      updateRecentMeasurements(parameter, measurements) {
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
        setState({deleteListLocationModalOpen: !state.deleteListLocationModalOpen})
      },
      setDeleteListLocationsId(listLocationsId: number) {
        setState({listLocationsId: listLocationsId})
      },
      setListParametersId(parametersId: number) {
        setState({listParametersId: parametersId})
      },
      setListParameter(parameter:string ) {
        setState({listParameter: parameter})
      }
    },
  ];

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

function useStoreContext() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStoreContext: cannot find a StoreContext")
  }
  return context
}

export function useStore() : Store  {
  return useStoreContext();
}
