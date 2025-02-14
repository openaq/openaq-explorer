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

                  <Show when={[30, 32, 41].includes(license?.id)}>
                    <img
                      src="/svgs/license-icons/cc-icon.svg"
                      loading="lazy"
                      alt="cc logo"
                      title="Creative Commons"
                      class="cc-license-img"
                    />
                  </Show>

                  {license?.commercialUseAllowed
                    ? ''
                    : `${(<img src="/svgs/license-icons/nc-icon.svg" loading="lazy" alt="" class="cc-license-img" />)}`}
                  {license?.attributionRequired
                    ? `${(<img src="/svgs/license-icons/by-icon.svg" loading="lazy" alt="" class="cc-license-img" />)}`
                    : ''}
                  {license?.shareAlikeRequired
                    ? `${(<img src="/svgs/license-icons/sa-icon.svg" loading="lazy" alt="" class="cc-license-img" />)}`
                    : ''}
                  {license?.modificationAllowed
                    ? `${(<img src="/svgs/license-icons/nd-icon.svg" loading="lazy" alt="" class="cc-license-img" />)}`
                    : ''}
                  <br />
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
      </Show>
    </>
  );
};
