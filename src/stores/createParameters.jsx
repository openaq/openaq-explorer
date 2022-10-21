import { createResource, createSignal } from 'solid-js';

export default function createLocations(
  client,
  actions,
  state,
  setState
) {
  let [parameters] = createResource(client.Parameters.getAll);

  Object.assign(actions, {});

  return parameters;
}
