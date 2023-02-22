// @ts-check
import { test, expect } from '@playwright/test';

test.describe('detail page', () => {
    test.beforeEach(async ({ page }) => {
    await page.goto('/#/locations/2178', { waitUntil: 'networkidle' });
  });

  test('breadcrumb naivgates home', async ({
    page,
  }) => {
    await page.locator('.breadcrumb-home').click()
    await expect(page).toHaveURL('https://openaq.org');
  });

  test('breadcrumb naivgates explore', async ({
    page,
  }) => {
    await page.locator('.breadcrumb-explore').click()
    await expect(page).toHaveURL('/#/');
  });


  test('download data anchor link jumps to section', async ({
    page,
  }) => {
    const downloadCard = page.locator('#download-card');
    expect(
        await downloadCard.evaluate(
          (node) => node.getBoundingClientRect().y
        )
      ).toBeGreaterThan(await page.evaluate(() => window.screen.height));
    await page.locator('.download-data-link').click()
    expect(
        await downloadCard.evaluate(
          (node) => node.getBoundingClientRect().y
        )
      ).toBeLessThan(await page.evaluate(() => window.screen.height));
  });

  test('map link navigates to OSM', async({page, context}) => {
    const pagePromise = context.waitForEvent('page');
    await page.locator('.map-open-link').click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    const osmPattern = /https\:\/\/www.openstreetmap.org\/\?mlat\=\d+\.\d+\&mlon\=\-*\d+\.\d+\&zoom\=\d+\#map\=\d+\/\d+\.\d+\/\-*\d+\.\d+/
    await expect(newPage).toHaveURL(osmPattern);
  })

  test('provider links to provider url', async({page , context}) => {
    const pagePromise = context.waitForEvent('page');
    await page.locator('.provider-link').click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    const osmPattern = /https\:\/\/www.openstreetmap.org\/\?mlat\=\d+\.\d+\&mlon\=\-*\d+\.\d+\&zoom\=\d+\#map\=\d+\/\d+\.\d+\/\-*\d+\.\d+/
    await expect(newPage).toHaveURL(osmPattern);
  })

  /* recent measurements */ 
  test('recent measurements parameter dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('recent measurements time period dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('recent measurements chart tooltip', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('recent measurements help shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('recent measurements how was this chart calculated shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  /* patterns chart */
  test('patterns parameter dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('patterns time period dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('patterns chart tooltip', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('patterns help shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('patterns how was this chart calculated shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })


  /* thresholds chart */
  test('thresholds parameter dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('thresholds time period dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('thresholds chart tooltip', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('thresholds help shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('thresholds how was this chart calculated shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  /* AQI chart */
  test('AQI parameter dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('AQI time period dropdown', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('AQI chart tooltip', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('AQI help shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  test('AQI how was this chart calculated shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
    
  })

  /* downloads section */

  test('downloads help shows help', async({page , context}) => {
    await expect(true).toBeFalsy()
  })

  test('download button downloads csv', async({page , context}) => {
    await expect(true).toBeFalsy()
  })

  test('API try this link button navigates', async({page , context}) => {
    await expect(true).toBeFalsy()
  })

});