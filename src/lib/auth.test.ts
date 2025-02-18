import { describe, test, expect } from 'vitest';
import {
  encode,
  parsePasswordHash,
  verifyPassword,
  isValidEmailDomain,
} from './auth';

describe('verifyPassword', async () => {
  test('verifyPassword works with salt without periods', async () => {
    const encodedPassword = await encode(
      'Qmx3zNPkj8kh6zmjcL5q',
      'JMFYF2zN2bsb4sxMqPXoev'
    );
    let match = await verifyPassword('Qmx3zNPkj8kh6zmjcL5q', encodedPassword);
    expect(match).toBe(true);
  });
  test('verifyPassword works with salt with periods', async () => {
    const encodedPassword = await encode(
      'Qmx3zNPkj8kh6zmjcL5q',
      'GT2pGKvbcxXcNfwL.Lo.VE'
    );
    let match = await verifyPassword('Qmx3zNPkj8kh6zmjcL5q', encodedPassword);
    expect(match).toBe(true);
  });
});

describe('parsePasswordHash', async () => {
  test('parsePasswordHash correctly parses encoded password', async () => {
    const encodedPassword =
      '$pbkdf2-sha256$29000$GT2pGKvbcxXcNfwL.Lo.VE$mn/dpofPwzWtaElHtuFR8y5JOH3o6gWLtZ.N3sicbXM';
    const { digest, iterations, salt, hash } =
      await parsePasswordHash(encodedPassword);
    expect(digest).toBe('sha256');
    expect(iterations).toBe(29000);
    expect(salt).toBe('GT2pGKvbcxXcNfwL.Lo.VE');
    expect(hash).toBe('mn/dpofPwzWtaElHtuFR8y5JOH3o6gWLtZ.N3sicbXM');
  });
  test('parsePasswordHash correctly parses encoded password generated from encode', async () => {
    const encodedPassword = await encode(
      'Qmx3zNPkj8kh6zmjcL5q',
      'GT2pGKvbcxXcNfwL.Lo.VE'
    );
    const { digest, iterations, salt } =
      await parsePasswordHash(encodedPassword);
    expect(digest).toBe('sha256');
    expect(iterations).toBe(29000);
    expect(salt).toBe('GT2pGKvbcxXcNfwL.Lo.VE');
  });
});

describe('isValidEmailDomain', async () => {
  test('isValidEmailDomain allow non-blocklist domain', async () => {
    const email = 'test@gmail.com';
    expect(isValidEmailDomain(email)).toBe(true);
  });
  test('isValidEmailDomain rejects blocklist domain', async () => {
    const email = 'test@sharkfaces.com';
    expect(isValidEmailDomain(email)).toBe(false);
  });
});
