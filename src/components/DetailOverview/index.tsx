import { For, Show, createSignal } from 'solid-js';
import { A, createAsync, useLocation } from '@solidjs/router';
import {
  LowCostSensorMarker,
  ReferenceGradeMarker,
} from '../LocationMarker';
import style from './DetailOverview.module.scss';
import { getUser } from '~/db';
import { clientOnly } from '@solidjs/start';
import { timeFromNow, since } from '~/lib/utils';
import { ListsForm } from '../Cards/ListsForm';

const DetailMap = clientOnly(() => import('~/components/DetailMap'));

interface SensorsDefinition {
  name: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Owner {
  id: number;
  name: string;
}

interface Provider {
  id: number;
  name: string;
}

interface Country {
  id: number;
  code: string;
  name: string;
}

interface Parameter {
  id: number;
  name: string;
  units: string;
  displayName: string;
}

interface Sensor {
  id: number;
  name: string;
  parameter: Parameter;
}

interface Datetime {
  utc: string;
  local: string;
}

interface DetailOverviewDefinition {
  id: number;
  name: string;
  coordinates: Coordinates;
  country: Country;
  owner: Owner;
  provider: Provider;
  isMonitor: boolean;
  sensors: Sensor[];
  datetimeFirst: Datetime;
  datetimeLast: Datetime;
  isMobile: boolean;
  lists: any[];
}

interface LocationsListDefinition {
  locationsId: number;
  lists: any[];
}

interface SensorTypeDefintion {
  isMonitor: boolean;
}

function SensorType(props: SensorTypeDefintion) {
  return (
    <div class={` ${style['location-type']}`}>
      <span class="type-body-3">
        {props.isMonitor ? 'Reference grade' : 'Air sensor'}
      </span>
      {props.isMonitor ? (
        <ReferenceGradeMarker />
      ) : (
        <LowCostSensorMarker />
      )}
    </div>
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
      <A href="/" class="icon-btn btn-secondary">
        Add to list <img src="/svgs/lists.svg" alt="" />
      </A>
    </div>
  );
}

export function DetailOverview(props: DetailOverviewDefinition) {
  const user = createAsync(() => getUser(), { deferStream: true });

  const pageLocation = useLocation();


  return (
    <section class={style['detail-overview']}>
      <div class={style['detail-overview__title']}>
        <div>
          <span class="type-subtitle-3 text-smoke-120">
            {props.country?.name}
          </span>
          <h1 class="type-display-1 text-sky-120">{props.name}</h1>
        </div>
        <div>
          <a
            href="#download-card"
            class={`icon-btn btn-tertiary ${style['download-anchor']}`}
          >
            Download data
            <img src="/svgs/download_ocean.svg" alt="" />
          </a>
        </div>
      </div>
      <div class={style['detail-overview__body']}>
        <div class={style['location-map']}>
          <DetailMap coordinates={props.coordinates} />
        </div>
        <div class={style.divider}> </div>
        <div class={style['location-characteristics']}>
          <h3>CHARACTERISTICS</h3>
          <table class={style['characteristics-table']}>
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
                      (o) =>
                        `${o.parameter.displayName} ${o.parameter.units}`
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
                    Updated {timeFromNow(props.datetimeLast?.local)}
                  </p>
                  <p>Since {since(props.datetimeFirst?.local)}</p>
                </td>
              </tr>
              <tr>
                <td>Provider</td>
                <td>
                  
                  {props.provider?.name}
                  
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class={style.divider}> </div>
        <div class={style['location-lists']}>
          <h3 class="type-subtitle-3 text-smoke-180">LISTS</h3>
          <Show
            when={user() && props.lists}
            fallback={<LocationListsFallback />}
          >
            <ul class={style['lists-list']}>
              <For each={props.lists}>
                {(list, i) => (
                  <A
                    class={style['list-link']}
                    href={`/lists/${list.listsId}`}
                  >
                    <li class="btn btn-tertiary">{list.label}</li>
                  </A>
                )}
              </For>
              <ListsForm redirect={pageLocation.pathname}/>
              {/* <LocationLists locationsId={props.id} /> */}
            </ul>
          </Show>
        </div>
      </div>
    </section>
  );
}
