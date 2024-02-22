'use server';
import { redirect } from '@solidjs/router';
import { useSession } from 'vinxi/http';

import { getRequestEvent } from 'solid-js/web';
import { db } from './db';
import crypto from 'crypto';
import { promisify } from 'util';
import { Buffer } from 'buffer';
import { encode, passlibify } from '~/lib/auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {validatePassword} from '~/lib/password';


const pbkdf2Async = promisify(crypto.pbkdf2);

dayjs.extend(utc);

async function checkPassword(password: string, hash: string) {
  'use server';

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
  'use server';

  return useSession({
    name: 'oaq_explorer_session',
    password:
      SESSION_SECRET,
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

export async function getUser() {
  'use server';

  const usersId = await getUsersId();

  if (typeof usersId !== 'number') {
    return null;
  }
  try {
    const user = await db.user.getUserById(usersId);
    return user[0];
  } catch {
    throw new Error();
  }
}

interface ListDefinition {
  listsId: number;
  ownersId: number;
  usersId: number;
  role: string;
  label: string;
  description: string;
  visibility: boolean;
  userCount: number;
  locationsCount: number;
  sensorNodesIds: number[];
  bbox: number[][];
}

export interface SensorDefinition {
  id: number;
  name: string;
  parameter: ParameterDefinition;
}

export interface ParameterDefinition {
  id: number;
  name: string;
  units: string;
  value_last: number;
  display_name: string;
  datetime_last: string;
}

interface ListItemDefinition {
  id: number;
  name: string;
  country: string;
  ismonitor: boolean;
  provider: string;
  sensors: SensorDefinition[];
  parameterIds: number[];
}

export async function userLists(): Promise<ListDefinition[]> {
  'use server';

  const usersId = await getUsersId();
  if (typeof usersId !== 'number') {
    throw new Error('');
  }
  try {
    const lists = await db.lists.getListsByUserId(usersId);
    return lists;
  } catch {
    throw new Error('');
  }
}

export async function list(listsId: number): Promise<ListDefinition> {
  'use server';

  const usersId = await getUsersId();
  if (typeof usersId !== 'number') {
    throw new Error('');
  }
  try {
    const list = db.lists.getListById(usersId, listsId);
    return list;
  } catch {
    throw new Error('');
  }
}

export async function listLocations(
  listsId: number
): Promise<ListItemDefinition[]> {
  'use server';

  const usersId = await getUsersId();
  if (typeof usersId !== 'number') {
    throw new Error('');
  }
  try {
    const lists = db.lists.getLocationsByListId(usersId, listsId);
    return lists;
  } catch {
    throw new Error('');
  }
}

export async function sensorNodesLists(
  sensorNodesId: number
): Promise<ListDefinition[]> {
  'use server';

  const usersId = await getUsersId();
  if (!usersId) {
    return []
  }
  try {
    const lists = db.lists.getListsBySensorNodesId(
      Number(usersId),
      Number(sensorNodesId)
    );
    return lists;
  } catch {
    throw new Error('Foo');
  }
}

export async function register(formData: FormData) {
  'use server';

  const event = getRequestEvent();
  const ip = event?.clientAddress
  const clientAddress = `${ip == '::1' ? '0.0.0.0' : ip}/32`; // does not work on localhost returns ::1/32
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
    throw new Error(`Form not submitted correctly.`);
  }
  if (emailAddress === '') {
    throw new Error('Valid email address required');
  }
  if (fullName === '') {
    throw new Error(`Name is required`);
  }
  if (password === '' || passwordConfirm === '') {
    throw new Error(`Password fields required`);
  }
  if (
    password !== passwordConfirm
  ) {
    throw new Error('Passwords must match');
  }
  const passwordHash = await encode(password);
  try {
   let user = await db.user.getUser(emailAddress);
    if (user[0]) {
      if (user[0].active) {
        throw redirect('/login');
      } else {
        throw redirect(`/verify-email?email=${emailAddress}`);
      }
    }
    await db.user.create(
      fullName,
      emailAddress,
      passwordHash,
      clientAddress
    );
    user = await db.user.getUser(emailAddress);
    await sendVerificationEmail(user[0].usersId);
  } catch (err) {
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
    const user = await db.user.getUser(email);
    if (!user[0]) {
      throw new Error('Invalid credentials');
    }
    if (!user[0].active) {
      throw redirect('/verify-email');
    }
    const isCorrectPassword = await checkPassword(
      password,
      user[0].passwordHash
    );
    if (!isCorrectPassword) {
      throw new Error('Invalid credentials');
    }
    const remember = rememberMe == 'on' ? true : false;
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const session = await getSession();
    await session.update((d) => (d.usersId = user[0].usersId));
    await session.update((d) => (d.maxAge = maxAge));
  } catch (err) {
    return err as Error;
  }
  throw redirect(redirectTo ?? '/');
}

export async function changePassword(formData: FormData) {
  'use server';

  let usersId = await getUsersId()
  if (!usersId) {
    throw redirect(`/`);
  }
  const password = String(formData.get('current-password'));
  const newPassword = String(formData.get('new-password'));
  const newPasswordConfirm = String(formData.get('confirm-new-password'));
  if (newPassword != newPasswordConfirm) {
    return new Error('New password fields must match');  
  }
  try {
    const user = await db.user.getUserById(usersId)
    if (!user[0]) {
      throw redirect('/');
    }
    if (!user[0].active) {
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
    await db.user.changePassword(user[0].usersId, newPasswordHash);
  } catch (err) {
    return err as Error;
  }
  throw redirect('/account')
}

export async function forgotPasswordLink(formData: FormData) {
  'use server';

  const emailAddress = String(formData.get('email-address'));
  const user = await db.user.getUser(emailAddress);
  if (!user[0]) {
    throw redirect('/check-email')
  }
  try {
    const url = new URL(import.meta.env.VITE_API_BASE_URL);
    url.pathname = `/auth/send-password-email`;
    const data = { emailAddress: emailAddress }
    const res = await fetch(url.href, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
      },
      body: JSON.stringify(data)
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
  const newPasswordConfirm = String(formData.get('confirm-new-password'));
  const user = await db.user.getUserByVerificationCode(verificationCode);
  if(new Date(user[0].expiresOn) < new Date()) {
    return new Error('Verification code expired, request a new password change email.')
  }
  try {
    validatePassword(newPassword, newPasswordConfirm)
    const newPasswordHash = await encode(newPassword);
    await db.user.changePassword(user[0].usersId, newPasswordHash);
  } catch (err) {
    return err as Error;
  }
  try {
    const url = new URL(import.meta.env.VITE_API_BASE_URL);
    url.pathname = `/auth/send-password-changed-email`;
    const data = { emailAddress: user[0].emailAddress }
    const res = await fetch(url.href, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
      },
      body: JSON.stringify(data)
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect('/login');
}

export async function logout(formData: FormData) {
  const redirectTo = String(formData.get('redirect'));

  const session = await getSession();
  await session.update((d) => (d.usersId = undefined));
  throw redirect(redirectTo);
}

export async function nameChange(formData: FormData) {
  const email = String(formData.get('email-address'));
  const password = String(formData.get('fullname'));
  const rememberMe = String(formData.get('new-fullname'));
}

export async function regenerateKey(formData: FormData) {
  'use server';
  const usersId = Number(formData.get('users-id'));
  const user = db.user.getUserById(usersId)
  try {
    await db.user.regenerateKey(usersId);
    try {
      const url = new URL(import.meta.env.VITE_API_BASE_URL);
      url.pathname = `/auth/regenerate-token`;
      const data = { usersId: usersId, token: user[0].token }
      const res = await fetch(url.href, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
        },
        body: JSON.stringify(data)
      });
    } catch (err) {
      return err as Error;
    }
    throw redirect('/account');
  } catch (err) {
    return err as Error;
  }
}

export async function newList(formData: FormData) {
  const usersId = Number(formData.get('users-id'));
  const label = String(formData.get('list-name'));
  const description = String(formData.get('list-description'));
  if (!label || label == '') {
    throw Error('Name required')
  }
  try {
    const listsId = await db.lists.createList(usersId, label, description);
    throw redirect(`/lists/${listsId[0].create_list}`);
  } catch (err) {
    return err as Error;
  }
}

export async function updateList(formData: FormData) {
  const listsId = Number(formData.get('lists-id'));
  const label = String(formData.get('list-name'));
  const description = String(formData.get('list-description'));
  try {
    await db.lists.updateList(listsId, label, description)
    throw redirect(`/lists/${listsId}`);
  } catch (err) {
    return err as Error;
  }
}

export async function deleteList(formData: FormData) {
  const listsId = Number(formData.get('lists-id'));
  try {
    await db.lists.deleteList(listsId);
    throw redirect(`/lists`);
  } catch (err) {
    return err as Error;
  }
}

export async function getLocationById(locationsId: number) {
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

export async function removeSensorNodesList(listsId: number, sensorNodesId: number) {
  const usersId = await getUsersId()
  if (!usersId) {
    throw redirect(`/lists/${listsId}`);
  }
  await db.lists.removeSensorNodeToList(listsId, sensorNodesId)
  throw redirect(`/lists/${listsId}`);
}

export async function addRemoveSensorNodesList(formData: FormData) {
  const usersId = await getUsersId()
  if (!usersId) {
    throw redirect('/');
  }
  const redirectTo = String(formData.get('redirect'));
  const sensorNodesId = Number(formData.get('sensor-nodes-id'));
  for (const [k,v] of formData.entries()) {
    if (k.includes('list-')) {
      const listsId = Number(k.split('-')[1])
      const isOn = Number(v) == 1
      const locations = await db.lists.getLocationsByListId(usersId, listsId);
      const locationIds = locations.map(o => o.id);
      if (locationIds.indexOf(sensorNodesId) === -1 && isOn) {
        await db.lists.addSensorNodeToList(listsId, sensorNodesId)
        throw redirect(`/lists/${listsId}`);
      }
      if (locationIds.indexOf(sensorNodesId) != -1 && !isOn) {
        await db.lists.removeSensorNodeToList(listsId, sensorNodesId)
        throw redirect(redirectTo);
      }
    }
  }
}

export async function sendVerificationEmail(usersId: number) {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/auth/send-verification`;
  const data = { usersId: usersId }
  const res = await fetch(url.href, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
    body: JSON.stringify(data)
  });
}

export async function verifyEmail(verificationCode: string) {
  'use server';
  const user = await db.user.getUserByVerificationCode(verificationCode);
  if (!user[0]) {
    //not a valid code
    throw redirect('/');
  }
  if (user[0].active) {
    // already verified
    throw redirect('/login');
  }
  if (dayjs(user[0].expiresOn) < dayjs(new Date())) {
    // expired
    throw redirect('/expired');
  }
  await db.user.verifyUserEmail(user[0].usersId);
  throw redirect('/email-verified');
}

export async function deleteListLocation(formData: FormData) {
  const listsId = Number(formData.get('lists-id'));
  const locationsId = Number(formData.get('locations-id'));

  try {
    await db.lists.deleteListLocation(listsId, locationsId);
    throw redirect(`/lists/${listsId}`);
  } catch (err) {
    return err as Error;
  }
}

