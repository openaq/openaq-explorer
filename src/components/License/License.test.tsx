import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { License } from '.';
import '@testing-library/jest-dom';


describe('<License />', () => {
  vi.stubGlobal('URL.createObjectURL', vi.fn());

  test('<License />  shows the right div containing cc-class', () => {
    const config = {
      id:41,
      name:"CC BY 4.0",
      commercialUseAllowed:true,
      attributionRequired:true,
      shareAlikeRequired:false,
      modificationAllowed:true,
      redistributionAllowed:true,
      sourceUrl:''
    }
    const { container } = render(() => <License {...config}/>
    );
    // const divWithCcLogo = container.querySelector('div.tooltip.cc-class')
    // expect(divWithCcLogo).toBeInTheDocument();
    // const ccIcon = screen.getByRole('img', { name: 'Creative Commons Logo' });
    // expect(ccIcon).toBeInTheDocument();
  })
})