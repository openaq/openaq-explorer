import { Show } from 'solid-js';
import { LicenseDefinition } from './types';
import '~/assets/scss/components/license.scss';

import CCIcon from '../../assets/imgs/license-icons/cc-icon.svg';
import NCIcon from '../../assets/imgs/license-icons/nc-icon.svg';
import BYIcon from '../../assets/imgs/license-icons/by-icon.svg';
import SAIcon from '../../assets/imgs/license-icons/sa-icon.svg';
import NDIcon from '../../assets/imgs/license-icons/nd-icon.svg';

export const License = (props: LicenseDefinition) => {
  return (
    <div>
      <div>
        {/* <p class="license-name">{props.name}</p> */}
        <a rel="noopener noreferrer" target="_blank" href={props?.sourceUrl}>
          {/* {props?.sourceUrl} */}
          {props.name}
        </a>
      </div>
      <div class="license-attribute-icons">
        <Show when={[30, 32, 41].includes(props?.id)}>
          <div class="tooltip" title="Creative Commons">
            <CCIcon
              role="img"
              aria-label="Creative Commons Logo"
              width={32}
              height={32}
              fill={'#5a6672'}
            />
          </div>
        </Show>

        <Show when={!props.commercialUseAllowed}>
          <div class="tooltip" title="Commercial Use Allowed">
            <NCIcon width={32} height={32} fill={'#5a6672'} />
          </div>
        </Show>

        <Show when={props.attributionRequired}>
          <div class="tooltip" title="Attribution Required">
            <BYIcon width={32} height={32} fill={'#5a6672'} />
          </div>
        </Show>

        <Show when={props.shareAlikeRequired}>
          <div class="tooltip" title="Share Alike Required">
            <SAIcon width={32} height={32} fill={'#5a6672'} />
          </div>
        </Show>

        <Show when={!props.modificationAllowed}>
          <div class="tooltip" title="Modification Allowed">
            <NDIcon width={32} height={32} fill={'#5a6672'} />
          </div>
        </Show>
      </div>
    </div>
  );
};
