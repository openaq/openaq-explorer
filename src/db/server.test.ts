import { describe, test, expect } from 'vitest';
import { isValidEmailDomain } from './server';

describe('isValidEmailDomain', async () => {
    test('isValidEmailDomain allow non-blocklist domain',async  () => {
        const email = 'test@gmail.com'
        expect(isValidEmailDomain(email)).toBe(true)
    });
    test('isValidEmailDomain rejects blocklist domain',async  () => {
        const email = 'test@sharkfaces.com'
        expect(isValidEmailDomain(email)).toBe(false)
    });
});
