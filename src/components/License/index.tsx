import { Show } from 'solid-js';
import { IconTooltipDefinition, LicenseDefinition } from './types';
import '~/assets/scss/components/license.scss';

import CCIcon from '~/assets/imgs/license-icons/cc-icon.svg';
import NCIcon from '~/assets/imgs/license-icons/nc-icon.svg';
import BYIcon from '~/assets/imgs/license-icons/by-icon.svg';
import SAIcon from '~/assets/imgs/license-icons/sa-icon.svg';
import NDIcon from '~/assets/imgs/license-icons/nd-icon.svg';

function IconTooltip(props: IconTooltipDefinition) {
  return (
    <div class="tooltip" title={props.title}>
      {props.children}
    </div>
  );
}

export function License(props: LicenseDefinition) {
  const svgAttributes = {
    width: 32,
    height: 32,
    fill: '#5a6672',
  };

  const isCreativeCommons = [30, 32, 41].indexOf(props.id) > -1;

  return (
    <div>
      <div>
        <a rel="noopener noreferrer" target="_blank" href={props.sourceUrl}>
          {props.name}
        </a>
      </div>
      <div class="license-attribute-icons">
        <Show when={isCreativeCommons}>
          <IconTooltip title={'Creative Commons'}>
            <CCIcon class="cc-class" {...svgAttributes} />
          </IconTooltip>
        </Show>
        <Show when={!props.commercialUseAllowed}>
          <IconTooltip
            title={'Only non-commercial uses of the work are permitted.'}
          >
            <NCIcon class="nc-class" {...svgAttributes} />
          </IconTooltip>
        </Show>
        <Show when={props.attributionRequired}>
          <IconTooltip
            title={'Attribution: Credit must be given to the creator.'}
          >
            <BYIcon class="by-class" {...svgAttributes} />
          </IconTooltip>
        </Show>
        <Show when={props.shareAlikeRequired}>
          <IconTooltip
            title={
              'Share Alike: Adaptations must be shared under the same terms.'
            }
          >
            <SAIcon {...svgAttributes} class="sa-class" />
          </IconTooltip>
        </Show>
        <Show when={!props.modificationAllowed}>
          <IconTooltip
            title={'No derivatives or adaptations of the work are permitted.'}
          >
            <NDIcon {...svgAttributes} class="nd-class" />
          </IconTooltip>
        </Show>
      </div>
    </div>
  );
}
