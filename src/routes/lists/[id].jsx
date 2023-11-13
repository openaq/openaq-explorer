import { createResource } from 'solid-js';
import { useRouteData } from 'solid-start';

export const routeData = (props) => {
  //const [story] = createResource(() => `item/${props.params.id}`, fetchAPI);
  return props.params.id;
};

export default function List() {
  const list = useRouteData();
  return <h1>{list}</h1>;
}
