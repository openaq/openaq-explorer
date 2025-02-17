import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { License } from '.';
import '@testing-library/jest-dom';


// test for is license null?
// test that cc licenses get a cc logo
// test a non cc license 


describe('<License />', () => {
  test('<License />  shows the right element and correct inner html', () => {
    const testLicenseName = 'Creative Commons License';

    render(() => (
      <License
        licenses={[
          {
            name: testLicenseName,
            id: 0,
            commercialUseAllowed: false,
            attributionRequired: false,
            shareAlikeRequired: false,
            modificationAllowed: false,
            redistributionAllowed: false,
            sourceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
          },
        ]}
      />
    ));

    const p = screen.getByText(testLicenseName);
    expect(p).toBeInTheDocument();
    expect(p).toHaveClass('license-name');

    const a = screen.getByRole('link');
    expect(a).toBeInTheDocument();
    expect(a).toHaveAttribute('href');
    expect(a).toHaveTextContent(
      'https://creativecommons.org/licenses/by-sa/4.0/'
    );
  });

  test('<License /> shows the Creative Commons logo for the right license ids', () => {
    render(() => (
      <License
        licenses={[
          {
            name: 'Creative Commons',
            id: 30,
            commercialUseAllowed: true,
            attributionRequired: false,
            shareAlikeRequired: false,
            modificationAllowed: false,
            redistributionAllowed: false,
            sourceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
          },
        ]}
      />
    ));

    const img = screen.getByRole('img', { name: /cc logo/i });
    expect(img).toHaveClass('cc-img');
    expect(img).toBeInTheDocument();
  });
  test('<License /> does not show the Creative Commons logo license ids without cc license', () => {
    render(() => (
      <License
        licenses={[
          {
            name: 'Creative Commons',
            id: 29,
            commercialUseAllowed: true,
            attributionRequired: false,
            shareAlikeRequired: false,
            modificationAllowed: false,
            redistributionAllowed: false,
            sourceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
          },
        ]}
      />
    ));

    const img = screen.queryByRole('img', { name: /cc logo/i });
    expect(img).toBeNull();
  });
});
