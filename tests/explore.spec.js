// @ts-check
import { test, expect } from '@playwright/test';



test.describe('explore page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('homepage naivgates', async ({
    page,
  }) => {
    await expect(page).toHaveURL('/#/');
  });

  test('overlay card collapses', async ({ page }) => {
    const cardBody = page.locator('.expandable-card__body');
    await expect(cardBody).toBeVisible();
    await page
      .locator(
        '.flip-card.explore-card > div > div.flip-card-front > div > div.expandable-card__header'
      )
      .click();
    await expect(cardBody).toBeVisible({ visible: false });
  });

  test('overlay card title changes on collapse', async ({ page }) => {
    const header = page.locator(
      '.flip-card.explore-card > div > div.flip-card-front > div > div.expandable-card__header > div > h3'
    );
    await expect(header).toHaveText('Overlay');
    await page
      .locator(
        '.flip-card.explore-card > div > div.flip-card-front > div > div.expandable-card__header'
      )
      .click();
    await expect(header).toHaveText('Overlay & Filters');
  });

  test('legend help toggles help card', async ({
    page,
  }) => {
    const helpCard = page.locator('.help-card');
    expect(
      await helpCard.evaluate(
        (node) => node.getBoundingClientRect().x
      )
    ).toBeGreaterThan(await page.evaluate(() => window.screen.width));
    await page.locator('.legend-help').click();
    await page.waitForTimeout(300); // wait for animation to finish
    expect(
      await helpCard.evaluate(
        (node) => node.getBoundingClientRect().x 
      )
    ).toBeLessThan(await page.evaluate(() => window.screen.width));
  });
});
