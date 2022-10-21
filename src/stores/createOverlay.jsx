import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { createResource } from 'solid-js';

export default function createOverlay(
  client,
  actions,
  state,
  setState
) {
  const [parameterId, setParameterId] = createSignal(2);

  // TODO when new endpoint is available it would be better to
  // only fetch a single parameter
  let [parameters] = createResource(client.Parameters.getAll);

  Object.assign(actions, {
    loadParameterId(id) {
      console.log(id);
      setState('parameter', 'id', id);
      setParameterId(id);
    },
  });

  return parameters;
}
