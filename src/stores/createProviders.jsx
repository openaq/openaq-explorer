import { createResource } from 'solid-js';

export default function createProviders(
  client,
  actions,
  state,
  setState
) {
  let [providers] = createResource(client.Providers.getAll);

  Object.assign(actions, {
    toggleProviderList: (show) => {
      setState('providerListActive', show);
    },
  });

  return providers;
}
