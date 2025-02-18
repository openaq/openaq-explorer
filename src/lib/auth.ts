import crypto from 'crypto';
import { promisify } from 'util';
import { customAlphabet } from 'nanoid';
import { disposableDomains } from '~/data/auth';
const pbkdf2Async = promisify(crypto.pbkdf2);

export async function checkPassword(password: string, hash: string) {
  'use server';
  const parts = hash.split('$');
  const salt = Buffer.from(parts[3], 'base64');
  let hashedPassword = await pbkdf2Async(
    password,
    salt,
    +parts[2],
    32,
    parts[1].split('-')[1]
  );
  const hashedPasswordB64 = passlibify(hashedPassword);
  return parts[4] == hashedPasswordB64;
}

export function passlibify(passhwordHash: Buffer): string {
  'use server';

  const b64str = passhwordHash
    .toString('base64')
    .trim()
    .replace(/={1,2}$/, '')
    .replace(/\+/g, '.');
  return Buffer.from(b64str).toString('ascii');
}

export function depasslibifySalt(salt: string): Buffer {
  'use server';

  const buf = Buffer.from(salt, 'base64');
  return buf;
}

function generateSalt(): string {
  'use server';

  const numbers = '1234567890';
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const capitalLetters = letters
    .split('')
    .map((o) => o.toUpperCase())
    .join('');
  const alphabet = numbers + letters + capitalLetters + './';
  const nanoid = customAlphabet(alphabet, 22);
  const salt = nanoid();
  return salt;
}

export async function encode(password: string, salt?: string): Promise<string> {
  'use server';
  salt = salt || generateSalt();
  const encodedSalt = Buffer.from(salt, 'base64');
  const iterations = 29000;
  const digest = 'sha256';
  const passhwordBuffer = await pbkdf2Async(
    password,
    encodedSalt,
    iterations,
    32,
    digest
  );
  const passhwordHash = passlibify(passhwordBuffer);
  return `$pbkdf2-${digest}$${iterations}$${salt}$${passhwordHash}`;
}

interface PasswordHash {
  digest: string;
  iterations: number;
  salt: string;
  hash: string;
}

export async function parsePasswordHash(
  passwordHash: string
): Promise<PasswordHash> {
  'use server';

  const [_, digest, iterations, salt, hash] = passwordHash.split('$');
  return {
    digest: digest.split('-')[1],
    iterations: Number(iterations),
    salt: salt,
    hash: hash,
  };
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  'use server';

  const { digest, iterations, salt, hash } =
    await parsePasswordHash(passwordHash);
  const hashedPassword = await pbkdf2Async(
    password,
    Buffer.from(salt, 'base64'),
    iterations,
    32,
    digest
  );
  return hash == passlibify(hashedPassword);
}

export function isValidEmailDomain(email: string): boolean {
  const emailDomain = email.split('@')[1];
  if (disposableDomains.has(emailDomain)) {
    return false;
  }
  return true;
}
