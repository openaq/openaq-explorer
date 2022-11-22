import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export default function createParameter(
  client,
  actions,
  state,
  setState
) {
  //const [parameterId, setParameter] = createSignal(2);
  const [parameter, setParameter] = createStore({
    id: 2,
    parameterName: 'PM 2.5',
    unit: 'µg/m³',
  });
  /*
  let [parameter] = createResource(
    parameterId,
    client.Parameters.get
  );
  */

  Object.assign(actions, {
    loadParameter(id) {
      console.log(id);
      const parameter = state
        .parameters()
        .find((x) => x.id === parseInt(id));
      setParameter({
        id: id,
        parameterName: parameter.displayName,
        unit: parameter.preferredUnit,
      });
    },
  });

  return parameter;
}
