import { redirect } from 'solid-start/server';
import { createCookieSessionStorage } from 'solid-start/session';
import { db } from '.';
import crypto from 'crypto';
import { promisify } from 'util';
import { Buffer } from 'buffer';
const pbkdf2Async = promisify(crypto.pbkdf2);

export async function register({ fullName, emailAddress, password, clientAddress }) {
  return db.user.create(fullName, emailAddress, password, clientAddress);
}

async function validatePassword(password, hash) {
  const parts = hash.split('$');
  let hashedPassword = await pbkdf2Async(
    password,
    Buffer.from(
      parts[3].replace(/\./g, '+') + '='.repeat(parts[3].length % 3),
      'base64'
    ),
    +parts[2],
    32,
    parts[1].split('-')[1]
  );
  hashedPassword = hashedPassword
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '.');
  return parts[4] == hashedPassword;
}

export async function login({ email, password }) {
  const user = await db.user.getUser(email);
  if (!user) return null;
  const isCorrectPassword = await validatePassword(
    password,
    user[0].passwordHash
  );
  if (!isCorrectPassword) return null;
  return user[0];
}

const sessionSecret =  "foooooo";
const USER_SESSION_MAX_AGE = 60 * 60 * 24;

const storage = createCookieSessionStorage({
  cookie: {
    name: 'oaq_explorer_session',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: USER_SESSION_MAX_AGE,
    httpOnly: true,
  },
});

export function getUserSession(request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string' || userId === 'undefined')
    return null;
  return userId;
}

export async function getUser(request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }
  try {
    const user = await db.user.getUserById(Number(userId));
    return user[0];
  } catch {
    throw logout(request);
  }
}

export async function requireUserId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([
      ['redirectTo', redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function logout(request) {
  const session = await storage.getSession(
    request.headers.get('Cookie')
  );
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function resendEmail(request) {
  const session = await storage.getSession(
    request.headers.get('Cookie')
  );
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}



export async function createUserSession(
  userId,
  redirectTo,
  remember
) {
  const session = await storage.getSession();
  session.set('userId', userId);
  const maxAge = remember
    ? USER_SESSION_MAX_AGE * 30
    : USER_SESSION_MAX_AGE;
  const cookie = await storage.commitSession(session, { maxAge });
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': cookie,
    },
  });
}
