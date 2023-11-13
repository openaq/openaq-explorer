import { A } from '@solidjs/router';
import { createResource } from 'solid-js';
import { useRouteData } from 'solid-start';

// export const routeData = (props) => {
//   const [story] = createResource(() => `item/${props.params.id}`, fetchAPI);
//   return props.params.id;
// };

export default function Lists() {
  // const location = useRouteData();
  return (
    <ul>
      <li>
        <A href="/lists/42">42</A>
        <A href="/lists/43">43</A>
      </li>
    </ul>
  );
}
