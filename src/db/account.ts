import { action, redirect } from '@solidjs/router';

import { checkPassword, encode } from '~/lib/auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { db } from '~/client/backend';
import { getSessionUser } from '~/auth/session';
import { evaluatePassword } from '~/lib/password';

dayjs.extend(utc);

export const changePassword = action(async (formData: FormData) => {
  'use server';

  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (!usersId) {
    throw redirect(`/`);
  }
  const password = String(formData.get('current-password'));
  const newPassword = String(formData.get('new-password'));
  const newPasswordConfirm = String(formData.get('confirm-new-password'));

  if (newPassword != newPasswordConfirm) {
    return new Error('New password fields must match');
  }
  const res = await db.getUserById(usersId);
  if (res.status === 404) {
    throw redirect('/');
  }
  const user = await res.json();
  if (!user[0].isActive) {
    throw redirect('/verify-email');
  }

  const isCorrectPassword = await checkPassword(password, user[0].passwordHash);
  const newPasswordHash = await encode(newPassword);

  if (!isCorrectPassword) {
    return new Error('Invalid credentials');
  }

  const result = evaluatePassword(newPassword);

  if (result.score < 4) {
    return new Error(`New password too weak: ${result.feedback.warning}`);
  }

  try {
    const res = await db.updateUserPassword({
      usersId: user[0].usersId,
      passwordHash: newPasswordHash,
    });
    const d = await res.json();
    console.info(`User ID ${d.usersid} changed password.`);
  } catch (err) {
    console.error(`password change failed: ${JSON.stringify(err)}`);
    return new Error('Failed to password change');
  }
  throw redirect('/account');
}, 'change-password-action');

export const regenerateKey = action(async (formData: FormData) => {
  'use server';
  const token = String(formData.get('token'));
  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (!usersId) {
    throw redirect(`/login`);
  }
  const userRes = await db.getUserById(usersId);
  if (!usersId) {
    throw redirect(`/login`);
  }
  const rows = await userRes.json();
  if (rows.length === 0) {
    throw redirect('/login');
  }
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/auth/regenerate-token`;
  const data = { usersId: usersId, token: token };
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
      },
      body: JSON.stringify(data),
    });
    await res.json();
  } catch (err) {
    console.error(`Regenerate key failed: ${err}`);
    return new Error('Failed to update key');
  }
  throw redirect('/account');
});
