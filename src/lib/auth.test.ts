import { describe, test, expect, vi } from 'vitest';
import {
  encode,
  parsePasswordHash,
  verifyPassword,
  isValidEmailDomain,
  signTimestamp,
  verifyTimestamp,
  normalizeEmail,
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

describe('signTimestamp', () => {
  test('returns a string in "timestamp.signature" format', () => {
    const timestamp = 1782945130000;
    const signed = signTimestamp(timestamp);

    expect(signed).toMatch(/^\d+\.[a-f0-9]{64}$/);
    expect(signed.split('.')[0]).toBe(String(timestamp));
  });

  test('produces different signatures for different timestamps', () => {
    const a = signTimestamp(1782945130000);
    const b = signTimestamp(1782945130001);

    expect(a).not.toBe(b);
  });

  test('produces the same signature for the same timestamp', () => {
    const timestamp = 178294513000;
    const a = signTimestamp(timestamp);
    const b = signTimestamp(timestamp);
    expect(a).toBe(b);
  });
});

describe('verifyTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(178294513000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns false when submitted before the expire window elapses', () => {
    const signed = signTimestamp(Date.now());
    expect(verifyTimestamp(signed)).toBe(false);
  });

  test('returns true once elapsed time is same as the expire window', () => {
    const startTime = Date.now();
    const signed = signTimestamp(startTime);

    vi.setSystemTime(startTime + 2000);

    expect(verifyTimestamp(signed)).toBe(true);
  });

  test('returns false when the signature has been tampered with', () => {
    const startTime = Date.now();
    const signed = signTimestamp(startTime);
    const [timestamp] = signed.split('.');
    const tampered = `${timestamp}.tampered${'0'.repeat(56)}`;
    vi.setSystemTime(startTime + 5000);

    expect(verifyTimestamp(tampered)).toBe(false);
  });

  test('returns false when the timestamp has been altered but signature reused', () => {
    const startTime = Date.now();
    const signed = signTimestamp(startTime);
    const [, signature] = signed.split('.');

    const backdated = `${startTime - 10000}.${signature}`;

    expect(verifyTimestamp(backdated)).toBe(false);
  });

  test('returns false for a malformed input with no signature', () => {
    expect(verifyTimestamp('12345')).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(verifyTimestamp('')).toBe(false);
  });

  test('returns false for a non-numeric timestamp', () => {
    const fakeSigned = signTimestamp(Date.now()).replace(/^\d+/, 'foobarbaz');
    expect(verifyTimestamp(fakeSigned)).toBe(false);
  });
});
describe('normalizeEmail', () => {
  test('lowercases and trims', () => {
    expect(normalizeEmail('  Foo.Bar@Gmail.COM  ')).toBe('foobar@gmail.com');
  });

  test('gmail, strips dots and plus-tags, aliases googlemail.com', () => {
    const variants = [
      'foobar@gmail.com',
      'foo.bar@gmail.com',
      'foo.bar+1@gmail.com',
      'foo.bar+1@googlemail.com',
    ];
    expect(new Set(variants.map(normalizeEmail))).toEqual(
      new Set(['foobar@gmail.com'])
    );
  });

  test('proton preserves dots, strips plus-tags, aliases protonmail.com and pm.me', () => {
    const variants = [
      'foo.bar@proton.me',
      'foo.bar+tag@protonmail.com',
      'foo.bar@pm.me',
    ];
    expect(new Set(variants.map(normalizeEmail))).toEqual(
      new Set(['foo.bar@proton.me'])
    );
  });

  test('outlook preserves dots, strips plus-tags, aliases hotmail.com/hotmail.co.uk/live.com/msn.com', () => {
    const variants = [
      'foo.bar+1@outlook.com',
      'foo.bar+1@hotmail.com',
      'foo.bar+1@hotmail.co.uk',
      'foo.bar+1@live.com',
      'foo.bar+1@msn.com',
    ];
    expect(new Set(variants.map(normalizeEmail))).toEqual(
      new Set(['foo.bar@outlook.com'])
    );
  });

  test('yahoo preserves dots, strips plus-tags, aliases ymail.com', () => {
    const variants = ['foo.bar+1@yahoo.com', 'foo.bar+1@ymail.com'];
    expect(new Set(variants.map(normalizeEmail))).toEqual(
      new Set(['foo.bar@yahoo.com'])
    );
  });

  test('icloud preserves dots, strips plus-tags, aliases me.com/mac.com', () => {
    const variants = [
      'foo.bar+1@icloud.com',
      'foo.bar+1@me.com',
      'foo.bar+1@mac.com',
    ];
    expect(new Set(variants.map(normalizeEmail))).toEqual(
      new Set(['foo.bar@icloud.com'])
    );
  });

  test('fastmail preserves dots, strips plus-tags', () => {
    expect(normalizeEmail('foo.bar+1@fastmail.com')).toBe(
      'foo.bar@fastmail.com'
    );
  });

  test('unrecognized domains no dot or plus stripping', () => {
    expect(normalizeEmail('foo.bar+1@example.com')).toBe(
      'foo.bar+1@example.com'
    );
  });

  test('handles missing @', () => {
    expect(normalizeEmail('not-an-email')).toBe('not-an-email');
  });
});