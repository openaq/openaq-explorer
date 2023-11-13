import {
  createHandler,
  renderAsync,
  StartServer,
} from 'solid-start/entry-server';
import { redirect } from 'solid-start/server';
import { getUser } from '~/db/session';

const protectedPaths = ['/lists', '/account'];

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      if (
        protectedPaths.includes(new URL(event.request.url).pathname)
      ) {
        const user = await getUser(event.request);
        if (!user) {
          return redirect('/');
        }
      }
      return forward(event);
    };
  },
  renderAsync((event) => <StartServer event={event} />)
);
