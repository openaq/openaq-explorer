import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import createLocation from './createLocation';
import createClient from './createClient';

const StoreContext = createContext();

export function Provider(props) {
  let location = props.location;
  let help;

  const [state, setState] = createStore({
    get location() {
      return location();
    },
    get help() {
      return help;
    },
  });
  const actions = {};
  const store = [state, actions];
  const client = createClient(store);
  location = createLocation(client, actions, state, setState);
  //   help = createHelp(client, actions, state, setState);

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
