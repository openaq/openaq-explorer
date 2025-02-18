import { test, expect, describe } from 'vitest';
import { transform } from './utils';

describe('transform', () => {
  test('transform returns correct typed array', () => {
    const series = [{ value: '42', date: '2016-03-06T19:00:00+00:00' }];
    const seriesData = transform(series);
    expect(seriesData).toStrictEqual([
      { value: 42, date: new Date('2016-03-06T19:00:00+00:00') },
    ]);
  });
});

// describe('splitMeasurements', () => {
//   test('toast shows message', () => {
//     expect(false).toBe(true);
//   });
// });

// describe('multiFormat', () => {
//   test('toast shows message', () => {
//     expect(false).toBe(true);
//   });
// });
