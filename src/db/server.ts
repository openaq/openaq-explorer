'use server';

import { redirect } from '@solidjs/router';
import { useSession } from 'vinxi/http';

import crypto from 'crypto';
import { promisify } from 'util';
import { Buffer } from 'buffer';
import { encode, passlibify, verifyPassword } from '~/lib/auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {getRequestEvent} from "solid-js/web";
import { validatePassword } from '~/lib/password';
import { disposableDomains } from '~/data/auth';
import { ListDefinition, ListItemDefinition, UserByIdDefinition } from './types';
import { db } from '~/client/backend';

const pbkdf2Async = promisify(crypto.pbkdf2);

dayjs.extend(utc);


async function checkPassword(password: string, hash: string) {
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

  const hashedPasswordB64 = passlibify(hashedPassword);
  return parts[4] == hashedPasswordB64;
}

const SESSION_SECRET = import.meta.env.VITE_SESSION_SECRET;
const USER_SESSION_MAX_AGE = 60 * 60 * 24;

async function getSession() {
  return useSession({
    name: 'oaq_explorer_session',
    password: SESSION_SECRET,
    maxAge: USER_SESSION_MAX_AGE,
  });
}

export async function getUsersId(): Promise<number | undefined> {
  'use server';
  const session = await getSession();
  const usersId = session.data.usersId;
  if (!usersId || usersId === 'undefined') return;
  return Number(usersId);
}

export async function getUser(): Promise<UserByIdDefinition> {
  'use server';
  try {
    const usersId = await getUsersId();
    if (usersId === undefined) {
      throw new Error('User not found');
    }
    const res = await db.getUserById(usersId);
    if (res.status == 404) {
      throw new Error('User not found');
    }
    let user;
    const rows = await res.json();
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    user = rows[0] as UserByIdDefinition
    return user;
  } catch (err) {
    console.info(err);
    throw redirect('/login');
  }
}



export async function userLists(): Promise<ListDefinition[]> {
  'use server';
  try {
    const usersId = await getUsersId();
    if (typeof usersId !== 'number') {
      throw new Error('User not found');
    }
    const res =  await db.getUserLists(usersId);
    if (res.status !== 200) {
      throw new Error();
    }
    const lists = await res.json();
    return lists as ListDefinition[];
  } catch(err) {
    console.error(err)
    return [];
  }
}

export async function list(listsId: number): Promise<ListDefinition> {
  'use server';

  try {
    const usersId = await getUsersId();
    if (usersId === undefined) {
      throw new Error('User not found');
    }
    if (typeof usersId !== 'number') {
      throw new Error('User not found');
    }
    const res = await db.getList(listsId); 
    const rows = await res.json();
    if (rows.length === 0) {
      throw new Error('List not found');
    }
    const list = rows[0] as ListDefinition;
    if (list.ownersId !== usersId) {
      throw redirect('/lists');
    }
    return list;
  } catch {
    throw redirect('/login');
  }
}

export async function listLocations(
  listsId: number
): Promise<ListItemDefinition[]> {
  'use server';

  try {
    const usersId = await getUsersId();
    if (usersId === undefined) {
      throw new Error('User not found');
    }
    if (typeof usersId !== 'number') {
      throw new Error('User not found');
    }
    const res  = await db.getListLocations(listsId);
    const lists = await res.json() as ListItemDefinition[];
    return lists;
  } catch {
    throw redirect('/login');
  }
}

export async function sensorNodesLists(
  sensorNodesId: number
): Promise<ListDefinition[]> {
  'use server';
  try {
    const usersId = await getUsersId();
    if (usersId === undefined) {
      throw new Error('User not found');
    }
    if (typeof usersId !== 'number') {
      throw new Error('User not found');
    }
    const res = await db.getLocationLists(usersId,sensorNodesId);
    const lists = await res.json();
    return lists;
  } catch {
    return [];
  }
}

export function isValidEmailDomain(email: string): boolean {
  const emailDomain = email.split('@')[1];
  if (disposableDomains.has(emailDomain)) {
    return false;
  }
  return true
}

export async function register(formData: FormData) {
  'use server';

  const event = getRequestEvent()
  const xForwardedFor = event?.request.headers.get("x-forwarded-for") || '';
  const ips = xForwardedFor?.split(', ');
  const ipAddress = ips[0] || '0.0.0.0';
  const fullName = String(formData.get('fullname'));
  const emailAddress = String(formData.get('email-address'));
  const password = String(formData.get('password'));
  const passwordConfirm = String(formData.get('password-confirm'));
  const forwardParams = String(formData.get('forwardParams')) || '';
  if (
    typeof emailAddress !== 'string' ||
    typeof fullName !== 'string' ||
    typeof password !== 'string' ||
    typeof passwordConfirm !== 'string' ||
    typeof forwardParams !== 'string'
  ) {
    return new Error(`Form not submitted correctly.`);
  }
  if (emailAddress === '') {
    return new Error('Valid email address required');
  }
  if (!isValidEmailDomain(emailAddress)) {
    console.info(`invalid email domain attempt: ${emailAddress}`);
    return new Error('Valid email address required - disposable email domains not allowed.');
  }
  if (fullName === '') {
    return new Error(`Name is required`);
  }
  if (password === '' || passwordConfirm === '') {
    return new Error(`Password fields required`);
  }
  if (password !== passwordConfirm) {
    return new Error('Passwords must match');
  } 
  const passwordHash = await encode(password);
  try {
    let res = await db.getUserByEmailAddress(emailAddress);
    if (res.status == 200) {
      const user = await res.json();
      if (user.active) {
        throw redirect('/login');
      } else {
        throw redirect(`/verify-email?email=${emailAddress}`);
      }
    }
    const createUserRes = await db.createUser({
      fullName,
      emailAddress,
      passwordHash,
      ipAddress
    })
    const newUser = await createUserRes.json();
    console.info(newUser)
    res = await db.getUserByEmailAddress(emailAddress);

    if (res.status === 200) {
      const user = await res.json()
      await sendVerificationEmail(user[0].usersId);
    }
    if (res.status === 404) {
      return new Error("failed to create new user")
    }
  } catch (err) {
    console.error(err);
    return err as Error;
  }
  throw redirect(`/verify-email?email=${emailAddress}`);
}

export async function login(formData: FormData) {
  'use server';
  const email = String(formData.get('email-address'));
  const password = String(formData.get('password'));
  const rememberMe = String(formData.get('remember-me'));
  const redirectTo = String(formData.get('redirect'));
  try {
    const res = await db.getUserByEmailAddress(email);
    if (res.status !== 200) {
    }
    const rows = await res.json()
    if (rows.length == 0) {
      throw new Error('Invalid credentials');
    }
    const user = rows[0]
    if (!user.isActive) {
      throw redirect('/verify-email');
    }
    const isCorrectPassword = await verifyPassword(
      password,
      user.passwordHash
    );
    if (!isCorrectPassword) {
      throw new Error('Invalid credentials');
    }
    const remember = rememberMe == 'on' ? true : false;
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const session = await getSession();
    await session.update((d) => (d.usersId = user.usersId));
    await session.update((d) => (d.maxAge = maxAge));
  } catch (err) {
    return err as Error;
  }
  throw redirect(redirectTo ?? '/');
}

export async function changePassword(formData: FormData) {
  'use server';

  let usersId = await getUsersId();
  if (!usersId) {
    throw redirect(`/`);
  }
  const password = String(formData.get('current-password'));
  const newPassword = String(formData.get('new-password'));
  const newPasswordConfirm = String(
    formData.get('confirm-new-password')
  );
  if (newPassword != newPasswordConfirm) {
    return new Error('New password fields must match');
  }
  try {
    const res = await db.getUserById(usersId);
    if (res.status === 404) {
      throw redirect('/');
    }
    const user = await res.json();
    if (!user.active) {
      throw redirect('/verify-email');
    }
    const newPasswordHash = await encode(newPassword);
    const isCorrectPassword = await checkPassword(
      password,
      user[0].passwordHash
    );
    if (!isCorrectPassword) {
      return new Error('Invalid credentials');
    }
    await db.updateUserPassword({
      usersId: user.usersId, 
      passwordHash: newPasswordHash
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect('/account');
}

export async function forgotPasswordLink(formData: FormData) {
  'use server';

  const emailAddress = String(formData.get('email-address'));
  const res = await db.getUserByEmailAddress(emailAddress);
  if (res.status === 404) {
    throw redirect('/check-email');
  }
  try {
    const url = new URL(import.meta.env.VITE_API_BASE_URL);
    url.pathname = `/auth/send-password-email`;
    const data = { emailAddress: emailAddress };
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect('/password-email');
}

export async function forgotPassword(formData: FormData) {
  'use server';
  const verificationCode = String(formData.get('verification-code'));
  const newPassword = String(formData.get('new-password'));
  const newPasswordConfirm = String(
    formData.get('confirm-new-password')
  );
  const res = await db.getUserByVerificationCode(verificationCode);
  if (res.status !== 200) {
    throw redirect('/login');
  }
  const user = await res.json();
  if (new Date(user.expiresOn) < new Date()) {
    return new Error(
      'Verification code expired, request a new password change email.'
    );
  }
  try {
    validatePassword(newPassword, newPasswordConfirm);
    const newPasswordHash = await encode(newPassword);
    const res = await db.updateUserPassword({
      usersId: user.usersId, 
      passwordHash: newPasswordHash
    })
  } catch (err) {
    return err as Error;
  }
  try {
    const url = new URL(import.meta.env.VITE_API_BASE_URL);
    url.pathname = `/auth/send-password-changed-email`;
    const data = { emailAddress: user[0].emailAddress };
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect('/login');
}

export async function logout(formData: FormData) {
  'use server';
  const redirectTo = String(formData.get('redirect'));
  const session = await getSession();
  await session.update((d) => (d.usersId = undefined));
  throw redirect(redirectTo);
}

export async function regenerateKey() {
  'use server';
  try {
    const usersId = await getUsersId();

    if (usersId === undefined) {
      throw new Error('User not found');
    }
    if (typeof usersId !== 'number') {
      throw new Error('User not found');
    }
    const userRes = await db.getUserById(usersId);
    if (userRes.status === 404) {
      throw new Error('User not found');
    }
    const rows = await userRes.json()
    if (rows.length === 0) {
      throw redirect('/login');
    }
    const user = rows[0]
    const url = new URL(import.meta.env.VITE_API_BASE_URL);
    url.pathname = `/auth/regenerate-token`;
    const data = { usersId: usersId, token: user.token };
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
      },
      body: JSON.stringify(data),
    });
    const d = await res.json();
  } catch (err) {
    throw redirect('/login');
  }
  throw redirect('/account');
}

export async function resendVerificationEmail(formData: FormData) {
  'use server';
  const verificationCode = String(formData.get('verification-code'));
  const res = await db.getUserByVerificationCode(verificationCode);
  if (res.status === 404) {
    throw redirect(`/login`);
  }
  const user = await res.json();
  if (user.active) {
    throw redirect(`/login`);
  }
  try {
    const url = new URL(import.meta.env.VITE_API_BASE_URL);
    url.pathname = `/auth/resend-verification-code`;
    const data = {
      usersId: user[0].usersId,
      verificationCode: verificationCode,
    };
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect(`/verify-email?email=${user[0].emailAddress}`);
}

export async function newList(formData: FormData) {
  'use server';
  const usersId = await getUsersId();
  if (!usersId) {
    throw redirect(`/login`);
  }
  const label = String(formData.get('list-name'));
  const description = String(formData.get('list-description'));
  if (!label || label == '') {
    throw Error('Name required');
  }
  try {
    const res = await db.createList({
      usersId,
      label,
      description
    });
    const newList = await res.json();
    throw redirect(`/lists/${newList.create_list}`);

  } catch (err) {
    return err as Error;
  }
}

export async function updateList(formData: FormData) {
  'use server';
  const listsId = Number(formData.get('lists-id'));
  const label = String(formData.get('list-name'));
  const description = String(formData.get('list-description'));
  try {
    const res = await db.updateList({
      listsId, label, description
    });
    throw redirect(`/lists/${listsId}`);
  } catch (err) {
    return err as Error;
  }
}

export async function deleteList(formData: FormData) {
  'use server';
  const listsId = Number(formData.get('lists-id'));

  try {
    const usersId = await getUsersId();
    if (usersId === undefined) {
      throw new Error('User not found');
    }
    if (typeof usersId !== 'number') {
      throw new Error('User not found');
    }
  } catch {
    throw redirect('/login');
  }

  try {
    await db.deleteList(listsId);
    throw redirect(`/lists`);
  } catch (err) {
    return err as Error;
  }
}

export async function getLocationById(locationsId: number) {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/v3/locations/${locationsId}`;

  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
  });
  const data = await res.json();
  return data.results[0];
}

export async function removeSensorNodesList(
  listsId: number,
  sensorNodesId: number
) {
  'use server';
  const usersId = await getUsersId();
  if (!usersId) {
    throw redirect(`/lists/${listsId}`);
  }
  await db.deleteListLocation(listsId, sensorNodesId);
  throw redirect(`/lists/${listsId}`);
}

export async function addRemoveSensorNodesList(formData: FormData) {
  'use server';

  const usersId = await getUsersId();
  if (!usersId) {
    throw redirect('/');
  }
  const redirectTo = String(formData.get('redirect'));
  const sensorNodesId = Number(formData.get('sensor-nodes-id'));
  for (const [k, v] of formData.entries()) {
    if (k.includes('list-')) {
      const listsId = Number(k.split('-')[1]);
      const isOn = Number(v) == 1;
      const res = await db.getListLocations(
        listsId
      );
      const locations = await res.json();
      const locationIds = locations.map((o) => o.id);
      if (locationIds.indexOf(sensorNodesId) === -1 && isOn) {
        await db.createListLocation(listsId, {locationsId: sensorNodesId});
        throw redirect(`/lists/${listsId}`);
      }
      if (locationIds.indexOf(sensorNodesId) != -1 && !isOn) {
        await db.deleteListLocation(listsId, sensorNodesId);
        throw redirect(redirectTo);
      }
    }
  }
}

export async function sendVerificationEmail(usersId: number) {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/auth/send-verification`;
  const data = { usersId: usersId };
  const res = await fetch(url.href, {
    method: 'POST',
    headers: {  
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
}

async function registerToken(usersId: any) {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/auth/register-token`;
  const data = {
    usersId: usersId,
  };
  const res = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
}

export async function verifyEmail(verificationCode: string) {
  'use server';
  const res = await db.getUserByVerificationCode(
    verificationCode
  );
  if (res.status == 404) {
    throw redirect('/');
  }
  const user = await res.json()
  if (user[0].active) {
    // already verified
    throw redirect('/login');
  }
  if (dayjs(user.expiresOn) < dayjs(new Date())) {
    // expired

    throw redirect(`/expired?code=${verificationCode}`);
  }
  await db.verifyUser(user[0].usersId)
  try {
    await registerToken(user[0].usersId);
  } catch (err) {
    return err as Error;
  }
  throw redirect('/email-verified');
}

export async function deleteListLocation(formData: FormData) {
  'use server';
  const listsId = Number(formData.get('lists-id'));
  const locationsId = Number(formData.get('locations-id'));
  try {
    const usersId = await getUsersId();
    if (usersId === undefined) {
      throw new Error('User not found');
    }
    if (typeof usersId !== 'number') {
      throw new Error('User not found');
    }
  } catch {
    throw redirect('/login');
  }

  try {
    await db.deleteListLocation(listsId, locationsId);
    throw redirect(`/lists/${listsId}`);
  } catch (err) {
    return err as Error;
  }
}


export async function redirectIfLoggedIn() {
  'use server';
  try {
    const usersId = await getUsersId();
    if (usersId !== undefined) {
      throw new Error('User not found');
    }
    return
  } catch {
    throw redirect('/');
  }
}