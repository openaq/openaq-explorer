import {
  AccessorWithLatest,
  createAsync,
  revalidate,
  RouteDefinition,
  useSubmission,
} from '@solidjs/router';
import { SessionData } from '~/auth/session';
import { createEffect, type ParentProps } from 'solid-js';
import { Header } from '~/components/Header';
import { getSessionData, login, logout } from '~/auth/user';

export const route: RouteDefinition = {
  preload: () => {
    return getSessionData();
  },
};

interface AccountStatus {
  isActive: boolean;
}

export default function Layout(props: ParentProps) {

  const sessionData = createAsync(() => getSessionData());

  const user = () => sessionData()?.user;
  const accountStatus = () => sessionData()?.accountStatus;

  const loginSubmission = useSubmission(login);
  const logoutSubmission = useSubmission(logout);

  createEffect(() => {
    if (loginSubmission.result !== undefined || loginSubmission.pending === false) {
      if (!loginSubmission.pending && loginSubmission.input) {
        revalidate(getSessionData.key);
      }
    }
  });

  createEffect(() => {
    if (!logoutSubmission.pending && logoutSubmission.input) {
      revalidate(getSessionData.key);
    }
  });

  return (
    <>
      <Header
        user={user as AccessorWithLatest<SessionData | undefined | null>}
        accountStatus={accountStatus as AccessorWithLatest<AccountStatus | undefined | null>}
      />
      <div>{props.children}</div>
    </>
  );
}
