import { sendRedirect } from 'vinxi/http';

import { getUsersId } from '~/db/server';
import { createMiddleware } from '@solidjs/start/middleware';

const protectedPaths = ['/lists', '/account'];
export default createMiddleware({
  onRequest: [
    async (event) => {
      const path = new URL(event.request.url).pathname.split('/')[1];
      if (protectedPaths.includes(`/${path}`)) {
        const user = await getUsersId();
        if (!user) {
          return sendRedirect(event, '/');
        }
        event.locals.user = user;
      }
    },
    async (event) => {
      if (
        ['/login', '/register'].includes(
          new URL(event.request.url).pathname
        )
      ) {
        const user = await getUsersId();
        if (user) {
          return sendRedirect(event, '/');
        }
      }
    },
  ],
});
