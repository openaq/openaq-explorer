import { Show } from 'solid-js';
import { LicenseDefinition } from './types';

import CCIcon from '../../assets/imgs/license-icons/cc-icon.svg';
import NCIcon from '../../assets/imgs/license-icons/nc-icon.svg';
import BYIcon from '../../assets/imgs/license-icons/by-icon.svg';
import SAIcon from '../../assets/imgs/license-icons/sa-icon.svg';
import NDIcon from '../../assets/imgs/license-icons/nd-icon.svg';

export const License = (props: LicenseDefinition) => {
  return (
    <div>
      <div>
        <p class="license-name">{props.name}</p>
        <a rel="noopener noreferrer" target="_blank" href={props?.sourceUrl}>
          {props?.sourceUrl}
        </a>
      </div>
      <div>
        <Show when={[30, 32, 41].includes(props?.id)}>
          <CCIcon width={32} height={32} fill={'#5a6672'} />
        </Show>

        <Show when={!props.commercialUseAllowed}>
          <NCIcon width={32} height={32} fill={'#5a6672'} />
        </Show>

        <Show when={props.attributionRequired}>
          <BYIcon width={32} height={32} fill={'#5a6672'} />
        </Show>

        <Show when={props.shareAlikeRequired}>
          <SAIcon width={32} height={32} fill={'#5a6672'} />
        </Show>

        <Show when={!props.modificationAllowed}>
          <NDIcon width={32} height={32} fill={'#5a6672'} />
        </Show>
      </div>
    </div>
  );
};
