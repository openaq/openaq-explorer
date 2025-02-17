import { Show, For } from 'solid-js';
import { Licenses } from '../DetailOverview/types';
import CCIcon from '../../assets/imgs/license-icons/cc-icon.svg';
import NCIcon from '../../assets/imgs/license-icons/nc-icon.svg';
import BYIcon from '../../assets/imgs/license-icons/by-icon.svg';
import SAIcon from '../../assets/imgs/license-icons/sa-icon.svg';
import NDIcon from '../../assets/imgs/license-icons/nd-icon.svg';

interface LicenseProps {
  licenses?: Licenses[];
}

export const License = (props: LicenseProps) => {
  const licensesData = props.licenses ?? [];

  return (
    <>
      <Show when={licensesData.length > 0}>
        <tr class="license-tr">
          <td>Licenses</td>
          <For each={props.licenses}>
            {(license) => (
              <>
                <td>
                  <p class="license-name">{license.name}</p>

                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={license?.sourceUrl}
                  >
                    {license?.sourceUrl}
                  </a>
                </td>
              </>
            )}
          </For>
        </tr>
        <tr>
          <td class="license-attributes">Attributes</td>
          <For each={props.licenses}>
            {(license) => (
              <td>
                <Show when={[30, 32, 41].includes(license?.id)}>
                  <CCIcon width={32} height={32} fill={'#5a6672'} />
                </Show>

                <Show when={!license.commercialUseAllowed}>
                  <NCIcon width={32} height={32} fill={'#5a6672'} />
                </Show>

                <Show when={license.attributionRequired}>
                  <BYIcon width={32} height={32} fill={'#5a6672'} />
                </Show>

                <Show when={license.shareAlikeRequired}>
                  <SAIcon width={32} height={32} fill={'#5a6672'} />
                </Show>

                <Show when={!license.modificationAllowed}>
                  <NDIcon width={32} height={32} fill={'#5a6672'} />
                </Show>
              </td>
            )}
          </For>
        </tr>
      </Show>
    </>
  );
};
