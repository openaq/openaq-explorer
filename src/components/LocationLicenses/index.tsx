import { createAsync, Params, useParams } from '@solidjs/router';
import { Show, For } from 'solid-js';
import { getLocationLicenses } from '~/client';

export const route = {
  preload: ({ params }: { params: Params }) => {
    getLocationLicenses(Number(params.id));
  },
};

export const LocationLicenses = () => {
  const { id } = useParams();

  const licenses = createAsync(() => getLocationLicenses(Number(id)), {
    deferStream: true,
  });

  return (
    <>
      <Show when={Array.isArray(licenses()) && licenses().length > 0}>
        <tr>
          <td>Licenses</td>
          <For each={licenses()}>
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
          <td>Attributes</td>
          <For each={licenses()}>
            {(license) => (
              <td>
                <Show when={[30, 32, 41].includes(license?.id)}>
                  <img
                    src="/svgs/license-icons/cc-icon.svg"
                    loading="lazy"
                    alt="cc logo"
                    title="Creative Commons"
                    class="cc-license-img"
                  />
                </Show>

                <Show when={!license.commercialUseAllowed}>
                  <img
                    src="/svgs/license-icons/nc-icon.svg"
                    loading="lazy"
                    alt="nc logo"
                    title="Commercial Use Allowed" 
                    class="cc-license-img"
                  />
                </Show>

                <Show when={license.attributionRequired}>
                  <img
                    src="/svgs/license-icons/by-icon.svg"
                    loading="lazy"
                    alt="by logo"
                    title="Attribution Required" 
                    class="cc-license-img"
                  />
                </Show>

                <Show when={license.shareAlikeRequired}>
                  <img
                    src="/svgs/license-icons/sa-icon.svg"
                    loading="lazy"
                    alt="sa logo"
                    title="Share Alike Required" 
                    class="cc-license-img"
                  />
                </Show>

                <Show when={!license.modificationAllowed}>
                  <img
                    src="/svgs/license-icons/nd-icon.svg"
                    loading="lazy"
                    alt="nd logo"
                    title="Modification Allowed" 
                    class="cc-license-img"
                  />
                </Show>
              </td>
            )}
          </For>
        </tr>
      </Show>
    </>
  );
};
