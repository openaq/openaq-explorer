import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { License } from '.';
import '@testing-library/jest-dom';

describe('<License />', () => {
  vi.stubGlobal('URL.createObjectURL', vi.fn());

  test('<License />  shows the right svg with class cc-class', () => {
    const config = {
      id: 41,
      name: 'CC BY 4.0',
      commercialUseAllowed: true,
      attributionRequired: true,
      shareAlikeRequired: false,
      modificationAllowed: true,
      redistributionAllowed: true,
      sourceUrl: '',
    };
    const { container } = render(() => <License {...config} />);
    const svg = container.querySelector('svg.cc-class');
    expect(svg).toBeInTheDocument();
  });

  test('<License />  shows all of the license logos', () => {
    const config = {
      id: 32,
      name: 'CC BY 4.0',
      commercialUseAllowed: false,
      attributionRequired: true,
      shareAlikeRequired: true,
      modificationAllowed: false,
      redistributionAllowed: false,
      sourceUrl: '',
    };
    const { container } = render(() => <License {...config} />);
    const svgcc = container.querySelector('svg.cc-class');
    const svgby = container.querySelector('svg.by-class');
    const svgnc = container.querySelector('svg.nc-class');
    const svgnd = container.querySelector('svg.nd-class');
    const svgsa = container.querySelector('svg.sa-class');
    expect(svgcc).toBeInTheDocument();
    expect(svgby).toBeInTheDocument();
    expect(svgnc).toBeInTheDocument();
    expect(svgnd).toBeInTheDocument();
    expect(svgsa).toBeInTheDocument();
  });

  test('<License />  shows multiple logos', () => {
    const config = {
      id: 41,
      name: 'CC BY 4.0',
      commercialUseAllowed: false,
      attributionRequired: false,
      shareAlikeRequired: true,
      modificationAllowed: false,
      redistributionAllowed: false,
      sourceUrl: '',
    };
    const { container } = render(() => <License {...config} />);
    const svgcc = container.querySelector('svg.cc-class');
    const svgby = container.querySelector('svg.by-class');
    const svgnc = container.querySelector('svg.nc-class');
    const svgnd = container.querySelector('svg.nd-class');
    const svgsa = container.querySelector('svg.sa-class');
    expect(svgcc).toBeInTheDocument();
    expect(svgby).not.toBeInTheDocument();
    expect(svgnc).toBeInTheDocument();
    expect(svgnd).toBeInTheDocument();
    expect(svgsa).toBeInTheDocument();
  });
  test('<License />  shows no logos', () => {
    const config = {
      id: 3,
      name: '',
      commercialUseAllowed: true,
      attributionRequired: false,
      shareAlikeRequired: false,
      modificationAllowed: true,
      redistributionAllowed: false,
      sourceUrl: '',
    };
    const { container } = render(() => <License {...config} />);
    const svgcc = container.querySelector('svg.cc-class');
    const svgby = container.querySelector('svg.by-class');
    const svgnc = container.querySelector('svg.nc-class');
    const svgnd = container.querySelector('svg.nd-class');
    const svgsa = container.querySelector('svg.sa-class');
    expect(svgcc).not.toBeInTheDocument();
    expect(svgby).not.toBeInTheDocument();
    expect(svgnc).not.toBeInTheDocument();
    expect(svgnd).not.toBeInTheDocument();
    expect(svgsa).not.toBeInTheDocument();
  });
});
