import {
  AccessorWithLatest,
  createAsync,
  RouteDefinition,
} from '@solidjs/router';
import { getSessionUser, SessionData } from '~/auth/session';
import { type ParentProps } from 'solid-js';
import { Header } from '~/components/Header';

export const route: RouteDefinition = {
  preload: () => {
    return getSessionUser();
  },
};

export default function Layout(props: ParentProps) {
  const user = createAsync(() => getSessionUser());

  return (
    <>
      <Header
        user={user as AccessorWithLatest<SessionData | undefined | null>}
      />
      <main>{props.children}</main>
    </>
  );
}
