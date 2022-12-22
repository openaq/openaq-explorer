// @ts-check
import { test, expect } from '@playwright/test';

test.describe('explore page', () => {
    test.setTimeout(120000)
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
    let pollutant = page.locator('accordion__body--open');
    expect(pollutant).toBeVisible({ visible: false });
  });

  test('flip card visibility changes', async ({ page }) => {
    const cardBack = page.locator('flip-card-back');
    expect(cardBack).toBeVisible({ visible: false });
    await page.getByRole('button', { name: 'Choose data providers tune' }).click();
    expect(cardBack).toBeVisible({ visible: true });
  });

  test('status badge changes' , async ({ page }) => {
    const statusDiv = await page.locator('body > div.flip-card.explore-card > div > div.flip-card-front > div > div.expandable-card__body.expandable-card__body--open > div > section:nth-child(1) > section:nth-child(2) > header > div:nth-child(2)');
    await page.getByText('Thresholdshelpvisibility_off').click();
    expect(statusDiv).toHaveClass('badge--status-ok'); // this should NOT pass right now
  });

  test('assert boxes are checked on page load', async ({ page }) => {
    await expect(page.getByLabel('Reference grade locations')).toBeChecked();
    await expect(page.getByLabel('Low-cost sensors locations')).toBeChecked();
    await expect(page.getByLabel('Show locations with no recent updates')).toBeChecked();
    await expect(page.getByLabel('Show locations with Poor data coverage')).toBeChecked();
  });

  test('Select PM10, assert network call and legend text', async ({ page }) => { 

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)'); // this looks for the text in the legend
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/1/1.pbf?parameter=1');
    await page.getByRole('combobox').first().selectOption('1');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM10 (µg/m³)');
  });

  test('Select O₃, assert network call and legend text', async ({ page }) => { 

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/2.pbf?parameter=3');
    await page.getByRole('combobox').first().selectOption('3');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('O₃ mass (µg/m³)');
  });

  test('Select co mass, assert network call and legend text', async ({ page }) => { 

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/1/1.pbf?parameter=4');
    await page.getByRole('combobox').first().selectOption('4');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('CO mass (µg/m³)');
  });

  test('Select NO₂ mass, assert network call and legend text', async ({ page }) => { 

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=5');
    await page.getByRole('combobox').first().selectOption('5');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('NO₂ mass (µg/m³)');
  });
 

  test('Select SO₂ mass, assert network call and legend text', async ({ page }) => { 

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=6');
    await page.getByRole('combobox').first().selectOption('6');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('SO₂ mass (µg/m³)');
  });

  test('Select NO₂ ppm, assert network call and legend text', async ({ page }) => { 

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=7');
    await page.getByRole('combobox').first().selectOption('7');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('NO₂ (ppm)');
  });

  test('Select CO ppm, assert network call and legend text', async ({ page }) => {
      
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=8');
    await page.getByRole('combobox').first().selectOption('8');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('CO (ppm)');
  });

  test('Select SO₂ ppm, assert network call and legend text', async ({ page }) => {
        
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=9');
    await page.getByRole('combobox').first().selectOption('9');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('SO₂ (ppm)');
  });

  test('Select O₃ ppm, assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=10');
    await page.getByRole('combobox').first().selectOption('10');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('O₃ (ppm)');
  });

  test('Select BC (µg/m³), assert network call and legend text', async ({ page }) => {
      
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=11');
    await page.getByRole('combobox').first().selectOption('11');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('BC (µg/m³)');
  });

  test('Select PM1 (µg/m³), assert network call and legend text', async ({ page }) => {
          
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/1.pbf?parameter=19');
    await page.getByRole('combobox').first().selectOption('19');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM1 (µg/m³)');
  });

  test('Select CO₂ (ppm), assert network call and legend text', async ({ page }) => {
                
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=21');
    await page.getByRole('combobox').first().selectOption('21');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('CO₂ (ppm)');
  });

  test('Select NOx mass (µg/m³), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=27');
    await page.getByRole('combobox').first().selectOption('27');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('NOx mass (µg/m³)');
  });

  test('Select CH₄ (ppm), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=28');
    await page.getByRole('combobox').first().selectOption('28');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('CH₄ (ppm)');
  });

  test('Select UFP count (particles/cm³), assert network call and legend text', async ({ page }) => {
      
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=33');
    await page.getByRole('combobox').first().selectOption('33');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('UFP count (particles/cm³)');
  });

  test('Select NO (ppm), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/0/2.pbf?parameter=35');
    await page.getByRole('combobox').first().selectOption('35');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('NO (ppm)');
  });

  test('Select PM1 count (particles/cm³), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/1.pbf?parameter=126');
    await page.getByRole('combobox').first().selectOption('126');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM1 count (particles/cm³)');
  });

  test('Select PM2.5 count (particles/cm³), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/1.pbf?parameter=130');
    await page.getByRole('combobox').first().selectOption('130');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM2.5 count (particles/cm³)');
  });

  test('Select PM10 count (particles/cm³), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/1.pbf?parameter=135');
    await page.getByRole('combobox').first().selectOption('135');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM10 count (particles/cm³)');
  });

  test('Select NOx (ppm), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/1.pbf?parameter=19840');
    await page.getByRole('combobox').first().selectOption('19840');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('NOx (ppm)');
  });

  test('Select NO mass (µg/m³), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/1.pbf?parameter=19843');
    await page.getByRole('combobox').first().selectOption('19843');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('NO mass (µg/m³)');
  });

  test('Select PM4 (µg/m³), assert network call and legend text', async ({ page }) => {

    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM 2.5 (µg/m³)');
    
    const requestPromise = page.waitForRequest('https://api.openaq.org/v2/locations/tiles/2/3/1.pbf?parameter=19844');
    await page.getByRole('combobox').first().selectOption('19844');
    expect (await requestPromise).toBeTruthy();
    await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
    .toHaveText('PM4 (µg/m³)');
  });

  const parameters = [
    { parametersId: '1', label: 'PM10 (µg/m³)', xyz:'2/1/1'},
    // { parametersId: '2', label: 'PM2.5 (µg/m³)'}, // default
    { parametersId: '3', label: 'O₃ mass (µg/m³)', xyz: '2/3/2'},
    { parametersId: '4', label: 'CO mass (µg/m³)', xyz: '2/1/1'},
    { parametersId: '5', label: 'NO₂ mass (µg/m³)', xyz: '2/0/2'},
    { parametersId: '6', label: 'SO₂ mass (µg/m³)', xyz: '2/0/2'},
    { parametersId: '7', label: 'NO₂ (ppm)', xyz: '2/0/2'},
    { parametersId: '8', label: 'CO (ppm)', xyz: '2/0/2'},
    { parametersId: '9', label: 'SO₂ (ppm)', xyz: '2/0/2'},
    { parametersId: '10', label: 'O₃ (ppm)', xyz: '2/0/2'},
    { parametersId: '11', label: 'BC (µg/m³)', xyz: '2/0/2'},
    { parametersId: '19', label: 'PM1 (µg/m³)', xyz: '2/3/1'},
    { parametersId: '21', label: 'CO₂ (ppm)', xyz: '2/0/2'}, 
    { parametersId: '27', label: 'NOx mass (µg/m³)', xyz: '2/3/1'},
    { parametersId: '28', label: 'CH₄ (ppm)', xyz: '2/0/2'},
    { parametersId: '33', label: 'UFP count (particles/cm³)', xyz: '2/3/1'},
    { parametersId: '35', label: 'NO (ppm)', xyz: '2/0/2'},
    { parametersID: '126', label: 'PM1 count (particles/cm³', xyz: '2/1/1'},
    { parametersId: '130', label: 'PM2.5 count (particles/cm³)', xyz: '2/3/1'},
    { parametersId: '135', label: 'PM10 count (particles/cm³)', xyz: '2/3/1'},
    { parametersId: '19840', label: 'NOx (ppm)', xyz: '2/3/1'},
    { parametersId: '19843', label: 'NO mass (µg/m³)', xyz: '2/3/1'},
    { parametersId: '19844', label: 'PM4 (µg/m³)', xyz: '2/3/1'},
  ];

  for (const parameter of parameters) {

    test(`Select ${parameter.label}, check network call`, async ({ page }) => {      
      const requestPromise = page.waitForRequest(`https://api.openaq.org/v2/locations/tiles/2/2/1.pbf?parameter=${parameter.parametersId}`);
      await page.getByRole('combobox').first().selectOption(`${parameter.parametersId}`);
      expect (await requestPromise).toBeTruthy();
    });

    test(`Select ${parameter.label}, check legend text`, async ({ page }) => {
      await page.getByRole('combobox').first().selectOption(`${parameter.parametersId}`);
      await expect(page.locator('body > div.map-legend > div > div.map-legend-section > div.map-legend-title > span.type-subtitle-3.text-smoke-120'))
      .toHaveText(`${parameter.label}`);
    });
  }

  // end of test suite
});
