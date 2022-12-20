// @ts-check
import { test, expect } from '@playwright/test';



test.describe('explore page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('homepage naivgates', async ({
    page,
  }) => {
    await page.goto('/');
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

  test('navigate to north valley location with search bar', async ({ page }) => {
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('albuquerque');
    await page.getByPlaceholder('Search').press('Enter');
    await page.waitForTimeout(3000); 
    await page.getByRole('region', { name: 'Map' }).click({
      position: {
        x: 842,
        y: 135
      }
    });
    await page.waitForTimeout(1000); 
    await page.getByRole('link', { name: 'Show Details arrow_right_alt' }).click();
    expect(page).toHaveURL('/locations/8708')
  });

  test('accordian visibility changes', async ({ page }) => {
    await page.getByText('Thresholdshelpvisibility_off').click();
    const pollutant = await page.locator('accordion__body--open');
    expect(pollutant).toBeVisible({ visible: false });
  });

  test('flip card visibility changes', async ({ page }) => {
    const cardBack = await page.locator('flip-card-back');
    expect(cardBack).toBeVisible({ visible: false });
    await page.getByRole('button', { name: 'Choose data providers tune' }).click();
    expect(cardBack).toBeVisible({ visible: true });
  });

  test('status badge changes' , async ({ page }) => {
    const statusDiv = await page.locator('body > div.flip-card.explore-card > div > div.flip-card-front > div > div.expandable-card__body.expandable-card__body--open > div > section:nth-child(1) > section:nth-child(2) > header > div:nth-child(2)');
    await page.getByText('Thresholdshelpvisibility_off').click();
    expect(statusDiv).toHaveClass('badge--status-ok'); // this should NOT pass right now
  });

  test('assert boxes checked and uncheck them', async ({ page }) => {
    await expect(page.getByLabel('Reference grade locations')).toBeChecked();
    await expect(page.getByLabel('Low-cost sensors locations')).toBeChecked();
    await expect(page.getByLabel('Show locations with no recent updates')).toBeChecked();
    await expect(page.getByLabel('Show locations with Poor data coverage')).toBeChecked();
    await page.getByLabel('Reference grade locations').uncheck();
    await page.getByLabel('Low-cost sensors locations').uncheck();
    await page.getByLabel('Show locations with no recent updates').uncheck();
    await page.getByLabel('Show locations with Poor data coverage').uncheck();
    await expect(page.getByLabel('Reference grade locations')).not.toBeChecked();
    await expect(page.getByLabel('Low-cost sensors locations')).not.toBeChecked();
    await expect(page.getByLabel('Show locations with no recent updates')).not.toBeChecked();
    await expect(page.getByLabel('Show locations with Poor data coverage')).not.toBeChecked();
  });

  test('change drop down and assert text', async ({ page }) => {
    await page.getByRole('combobox').first().selectOption('1');
    await expect(page.locator('select').first()).toHaveText('PM10 µg/m³');
  });

  
});
