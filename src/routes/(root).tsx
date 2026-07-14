import {
  AccessorWithLatest,
  createAsync,
  RouteDefinition,
} from '@solidjs/router';
import { getSessionUser, SessionData } from '~/auth/session';
import { type ParentProps } from 'solid-js';
import { Header } from '~/components/Header';
import { getUserAccountStatus } from '~/auth/user';

export const route: RouteDefinition = {
  preload: () => {
    return getSessionUser();
  },
};

export default function Layout(props: ParentProps) {
  const user = createAsync(() => getSessionUser());
  const accountStatus = createAsync(
    () => {
      const u = user();
      if (!u?.usersId) return Promise.resolve(null);
      return getUserAccountStatus();
    },
    { deferStream: true }
  );

  return (
    <>
      <Header
        user={user as AccessorWithLatest<SessionData | undefined | null>}
        accountStatus={accountStatus}
      />
      <div>{props.children}</div>
    </>
  );
}
