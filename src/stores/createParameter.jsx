import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export default function createParameter(
  client,
  actions,
  state,
  setState
) {
  //const [parameterId, setParameter] = createSignal(2);
  const [parameter, setParameter] = createStore({ id: 2 });
  /*
  let [parameter] = createResource(
    parameterId,
    client.Parameters.get
  );
  */

  Object.assign(actions, {
    loadParameter(id) {
      setParameter({ id: id });
    },
  });

  return parameter;
}
