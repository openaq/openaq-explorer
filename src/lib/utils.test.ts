import { describe, test, expect } from 'vitest';
import { validatePassword } from './password';

describe('validatePassword', async () => {
  test('weak password throws error', async () => {
    expect(() => validatePassword('password', 'password')).toThrowError();
  });
  test('passwords dont match throws error', async () => {
    expect(() => validatePassword('password', 'password1')).toThrowError();
  });
  test('password too short', async () => {
    expect(() => validatePassword('f0ZJuZA', 'f0ZJuZA')).toThrowError();
  });
  test('multiple errors', async () => {
    try {
      validatePassword('pass', 'passw');
      expect(true).toBe(false);
    } catch (e) {
      expect(e.errors).toHaveLength(3);
    }
  });
});
