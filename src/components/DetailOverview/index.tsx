import { For, Show } from 'solid-js';
import { A, createAsync, useLocation } from '@solidjs/router';

import { timeFromNow, since } from '~/lib/utils';
import { ListsForm } from '~/components/Cards/ListsForm';

import { DetailMap } from '~/components/DetailMap';
import { SensorType } from './SensorType';

import '~/assets/scss/components/detail-overview.scss';
import { DetailOverviewDefinition } from './types';
import { sensorNodeLists } from '~/db/lists';
import { License } from '../License';
import CloudDownloadIcon from '~/assets/imgs/cloud_download.svg';
interface ListsDefinition {
  sensorNodesId: number;
  pathname: string;
}

function LocationLists(props: ListsDefinition) {
  const lists = createAsync(() => sensorNodeLists(props.sensorNodesId), {
    initialValue: [],
    deferStream: true,
  });

  return (
    <ul class="lists-list">
      <For each={lists()}>
        {(list) => (
          <A class="list-link" href={`/lists/${list.listsId}`}>
            <li class="btn btn-tertiary">{list.label}</li>
          </A>
        )}
      </For>
      <ListsForm redirect={props.pathname} />
    </ul>
  );
}

function LocationListsFallback() {
  const pageLocation = useLocation();

  return (
    <div>
      <span class="type-body-3">
        <A
          href={`/register?redirect=${pageLocation.pathname}`}
          class="text-ocean-120"
        >
          Sign up
        </A>{' '}
        or{' '}
        <A
          href={`/login?redirect=${pageLocation.pathname}`}
          class="text-ocean-120"
        >
          login
        </A>{' '}
        to add this location to a list.
      </span>
    </div>
  );
}

export function DetailOverview(props: DetailOverviewDefinition) {
  const pageLocation = useLocation();

  const svgAttributes = {
    width: 24,
    height: 24,
  };

  return (
    <section class="detail-overview">
      <div class="detail-overview__title">
        <div>
          <span class="type-subtitle-3 text-smoke-120">{props?.name}</span>
          <h1 class="type-display-1 text-sky-120">
            {props.name || 'No label'}
          </h1>
        </div>
        <div>
          <Show when={props.datetimeFirst}>
            <a
              href="#download-card"
              class="icon-btn btn-tertiary download-anchor"
            >
              Download data
              <CloudDownloadIcon
                class="cloud-download-icon"
                {...svgAttributes}
              />
            </a>
          </Show>
        </div>
      </div>
      <div class="detail-overview__body">
        <div class="location-map">
          <DetailMap coordinates={props.coordinates} />
        </div>
        <div class="divider"> </div>
        <div class="location-characteristics">
          <h3>CHARACTERISTICS</h3>
          <table class="characteristics-table">
            <tbody>
              <tr>
                <td>Type</td>{' '}
                <td>
                  <SensorType {...props} />
                  <p class="type-body-2">
                    {props.isMobile ? 'Mobile' : 'Stationary'}
                  </p>
                </td>
              </tr>
              <tr>
                <td>Owner</td>
                <td>{props.owner?.name}</td>
              </tr>
              <tr>
                <td>Measures</td>
                <td>
                  {props.sensors
                    ?.map(
                      (o) => `${o.parameter.displayName} ${o.parameter.units}`
                    )
                    .join(', ')}
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{props.name}</td>
              </tr>
              <tr>
                <td>Reporting</td>
                <td>
                  <p>
                    {props.datetimeLast
                      ? `Updated ${timeFromNow(props.datetimeLast?.local)}`
                      : 'No measurements'}
                  </p>
                  <p>
                    {props.datetimeLast
                      ? `Reporting since ${since(props.datetimeFirst?.local)}`
                      : 'No measurements'}
                  </p>
                </td>
              </tr>
              <tr>
                <td>Provider</td>
                <td>{props.provider?.name}</td>
              </tr>
              <Show
                when={
                  Array.isArray(props.licenses) && props.licenses.length > 0
                }
              >
                <tr>
                  <td>Licenses</td>
                  <td>
                    <For each={props.licenses}>
                      {(license) => <License {...license} />}
                    </For>
                  </td>
                </tr>
              </Show>
            </tbody>
          </table>
        </div>
        <div class="divider"> </div>
        <div class="location-lists">
          <h3 class="type-subtitle-3 text-smoke-180">LISTS</h3>
          <Show
            when={props.user?.()?.usersId}
            fallback={<LocationListsFallback />}
          >
            {props.lists}
            <LocationLists
              sensorNodesId={props.id}
              pathname={pageLocation.pathname}
            />
          </Show>
        </div>
      </div>
    </section>
  );
}
