import { clearSession, getSessionUser, setSession } from './session';
import { db, UserResponse } from '~/client/backend';
import { encode, isValidEmailDomain, verifyPassword } from '~/lib/auth';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { action, query, redirect, revalidate } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { validatePassword } from '~/lib/password';

dayjs.extend(utc);

export const redirectIfLoggedIn = query(async (): Promise<void> => {
  'use server';
  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (usersId) {
    throw redirect('/');
  }
}, 'redirect-if-logged-in');

export const getLoggedInUser = query(async () => {
  'use server';
  const session = await getSessionUser();
  const usersId = session?.usersId;
  let res;
  if (typeof usersId === 'number') {
    res = await db.getUserById(usersId);
  } else {
    throw redirect('/');
  }
  if (res.status === 404) {
    throw redirect('/');
  }
  const user = (await res.json()) as UserResponse;
  if (user.length > 0) {
    return {
      email: user[0].emailAddress,
      fullname: user[0].fullname,
      token: user[0].token,
      isActive: user[0].isActive
    };
  } else {
    throw redirect('/');
  }
}, 'get-logged-in-user');

export const register = action(async (formData: FormData) => {
  'use server';

  const event = getRequestEvent();
  const xForwardedFor = event?.request.headers.get('x-forwarded-for') || '';
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
    return new Error(
      'Valid email address required - disposable email domains not allowed.'
    );
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
  let res = await db.getUserByEmailAddress(emailAddress);
  if (res.status == 200) {
    // user already exists
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
    ipAddress,
  });
  await createUserRes.json();
  try {
    res = await db.getUserByEmailAddress(emailAddress);
    if (res.status === 200) {
      const user = await res.json();
      await sendVerificationEmail(user[0].usersId);
    }
    if (res.status === 404) {
      throw new Error('failed to create new user');
    }
  } catch (err) {
    return err as Error;
  }
  throw redirect(`/verify-email?email=${emailAddress}`);
}, 'register-action');

export const login = action(async (formData: FormData) => {
  'use server';

  const email = String(formData.get('email-address'));
  const password = String(formData.get('password'));
  const rememberMe = String(formData.get('remember-me') ?? false);
  const redirectTo = String(formData.get('redirect'));
  try {
    const res = await db.getUserByEmailAddress(email);
    if (res.status !== 200) {
      throw new Error('Invalid credentials');
    }
    const rows = await res.json();
    if (rows.length == 0) {
      throw new Error('Invalid credentials');
    }
    const user = rows[0];
    if (!user.isVerified) {
      throw redirect('/verify-email');
    }
    const isCorrectPassword = await verifyPassword(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new Error('Invalid credentials');
    }
    const remember = rememberMe == 'on' ? true : false;
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    await setSession(user.usersId, maxAge);
  } catch (err) {
    return err as Error;
  }
  throw redirect(redirectTo ?? '/', {
    revalidate: [getSessionUser.key, getLoggedInUser.key],
  });
}, 'login-action');

export const logout = action(async () => {
  'use server';
  await clearSession();
  return revalidate([getSessionUser.key, getLoggedInUser.key]);
}, 'logout-action');

export const sendVerificationEmail = async (usersId: number) => {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/auth/send-verification`;

  const data = { usersId: usersId };

  const res = await fetch(url.href, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
  await res.json();
};

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

export const verifyEmail = query(async (verificationCode: string) => {
  'use server';
  const res = await db.getUserByVerificationCode(verificationCode);
  if (res.status == 404) {
    throw redirect('/');
  }
  const user = await res.json();
  if (user[0].active) {
    // already verified
    throw redirect('/login');
  }
  if (dayjs() < dayjs(user.expiresOn)) {
    // expired
    throw redirect(`/expired?code=${verificationCode}`);
  }
  await db.verifyUser(user[0].usersId);
  try {
    await registerToken(user[0].usersId);
  } catch (err) {
    console.error('failed to register token', err);
    return err as Error;
  }
  throw redirect('/email-verified');
}, 'verify-email-action');

export const resendVerificationEmail = action(async (formData: FormData) => {
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
}, 'resend-verification-email-action');

export const forgotPasswordLink = action(async (formData: FormData) => {
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
}, 'forgot-password-link-action');

export const forgotPassword = action(async (formData: FormData) => {
  'use server';
  const verificationCode = String(formData.get('verification-code'));
  const newPassword = String(formData.get('new-password'));
  const newPasswordConfirm = String(formData.get('confirm-new-password'));
  const res = await db.getUserByVerificationCode(verificationCode);
  if (res.status !== 200) {
    throw redirect('/login');
  }
  const user = await res.json();
  if (dayjs() > dayjs(user[0].expiresOn)) {
    return new Error(
      'Verification code expired, request a new password change email.'
    );
  }
  try {
    validatePassword(newPassword, newPasswordConfirm);
    const newPasswordHash = await encode(newPassword);
    const { usersId } = user[0];
    const res = await db.updateUserPassword({
      usersId: usersId,
      passwordHash: newPasswordHash,
    });
    if (res.status !== 200) {
      console.error(
        `Failed to update user password: ${res.url} HTTP ${res.status}`
      );
      return new Error('Failed to update password');
    }
    const d = await res.json();
    console.info(`User ID ${d.usersid} changed password.`);
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
}, 'forgot-password-action');
