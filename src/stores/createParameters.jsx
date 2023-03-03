import { createResource } from 'solid-js';

export default function createLocations(client, actions) {
  let [parameters] = createResource(client.Parameters.getAll);

  Object.assign(actions, {});

  return parameters;
}
