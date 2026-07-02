import { describe, test, expect, vi } from 'vitest';
import {
  encode,
  parsePasswordHash,
  verifyPassword,
  isValidEmailDomain,
  signTimestamp,
  verifyTimestamp,
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
  it('returns a string in "timestamp.signature" format', () => {
    const timestamp = 1782945130000;
    const signed = signTimestamp(ts);

    expect(signed).toMatch(/^\d+\.[a-f0-9]{64}$/);
    expect(signed.split('.')[0]).toBe(String(timestamp));
  });

  it('produces different signatures for different timestamps', () => {
    const a = signTimestamp(1782945130000);
    const b = signTimestamp(1782945130001);

    expect(a).not.toBe(b);
  });

  it('produces the same signature for the same timestamp', () => {
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

  it('returns false when submitted before the expire window elapses', () => {
    const signed = signTimestamp(Date.now());
    expect(verifyTimestamp(signed)).toBe(false);
  });

  it('returns true once elapsed time is same as the expire window', () => {
    const startTime = Date.now();
    const signed = signTimestamp(startTime);

    vi.setSystemTime(startTime + 2000);

    expect(verifyTimestamp(signed)).toBe(true);
  });

  it('returns false when the signature has been tampered with', () => {
    const startTime = Date.now();
    const signed = signTimestamp(startTime);
    const [timestamp] = signed.split('.');
    const tampered = `${timestamp}.tampered${'0'.repeat(56)}`;
    vi.setSystemTime(startTime + 5000);

    expect(verifyTimestamp(tampered)).toBe(false);
  });

  it('returns false when the timestamp has been altered but signature reused', () => {
    const startTime = Date.now();
    const signed = signTimestamp(startTime);
    const [, signature] = signed.split('.');

    const backdated = `${startTime - 10000}.${signature}`;

    expect(verifyTimestamp(backdated)).toBe(false);
  });

  it('returns false for a malformed input with no signature', () => {
    expect(verifyTimestamp('12345')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(verifyTimestamp('')).toBe(false);
  });

  it('returns false for a non-numeric timestamp', () => {
    const fakeSigned = signTimestamp(Date.now()).replace(/^\d+/, 'foobarbaz');
    expect(verifyTimestamp(fakeSigned)).toBe(false);
  });
});
