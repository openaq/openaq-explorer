// @ts-check
import { test, expect } from '@playwright/test';

test.describe('openaq page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://openaq-staging.org/', { waitUntil: 'networkidle' });
    });

    test('network test', async ({ page }) => { 
        const [response] = await Promise.all([
          page.waitForResponse('https://openaq-staging.org/'),
          await page.locator('body > header > div > a.header-logo > img').click(),
        ]);
        expect(response.status()).toBe(200);
      });

    test('link test', async ({ page }) => { 
        const [response] = await Promise.all([
          page.waitForResponse('https://openaq-staging.org/why-air-quality/'),
          await page.locator('body > header > div > nav > ul > li:nth-child(2) > a').click(),
        ]);
        expect(response.status()).toBe(200);
      });

});
