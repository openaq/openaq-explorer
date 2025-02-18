import { query } from '@solidjs/router';
import { SessionConfig, useSession } from 'vinxi/http';

export interface SessionData {
  usersId: number | undefined | null;
}

const SESSION_SECRET = import.meta.env.VITE_SESSION_SECRET;
const USER_SESSION_MAX_AGE = 60 * 60 * 24;

export function getSession() {
  'use server';

  return useSession({
    name: 'oaq_explorer_session',
    password: SESSION_SECRET,
    maxAge: USER_SESSION_MAX_AGE,
  });
}

export const getSessionUser = query(async () => {
  'use server';

  const { data: sessionData } = await getSession();

  return sessionData.usersId ? sessionData : null;
}, 'session-user');

export async function setSession(usersId: number, maxAge: number) {
  'use server';
  const session = await getSession();

  await session.update((user: SessionData) => ((user.usersId = usersId), user));
  await session.update((d: SessionConfig) => {
    d.maxAge = maxAge;
  });
}

export async function clearSession() {
  'use server';
  const session = await getSession();

  await session.update((user: SessionData) => (user.usersId = undefined));
}
