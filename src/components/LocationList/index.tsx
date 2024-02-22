import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';
import style from './LocationList.module.scss';
import {
  ReferenceGradeMarker,
  LowCostSensorMarker,
} from '../LocationMarker';
import {NoLocationsFallback} from './NoLocationsFallback';
import { useStore } from '~/stores';

export interface SensorDefinition {
  id: number;
  name: string;
  parameter: ParameterDefinition;
}

export interface ParameterDefinition {
  id: number;
  name: string;
  units: string;
  value_last: number;
  display_name: string;
  datetime_last: string;
}

interface LocationListItemDefinition {
  id: number;
  name: string;
  country: string;
  ismonitor: boolean;
  provider: string;
  sensors: SensorDefinition[];
  parameterIds: number[];
}

interface LocationListItems {
  locations: LocationListItemDefinition[]
}

export function LocationListItem(props: LocationListItemDefinition) {
  const [store, { setDeleteListLocationsId, toggleDeleteListLocationModalOpen }] = useStore();


  return (
    <li class={style['location-list-item']}>

    <A href={`/locations/${props.id}`}>
        <div class={style['location-info']}>
          <div class={style['location-info__title']}>
            {props.ismonitor ? <ReferenceGradeMarker /> : <LowCostSensorMarker/>}
            <h3>{props.name}</h3>
          </div>
          <div class={style['location-info__body']}>
            <div>
            <div class={style['locality']}>{props.country}</div>
            <table class={style['characteristics-table']}>
              <tbody>
                <tr>
                  <td>Provider</td>
                  <td>{props.provider}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{props.ismonitor ? 'Reference Grade' : "Air sensor"}</td>
                </tr>
                <tr>
                  <td>Measures</td>
                  <td>{props.sensors.map(o => `${o.parameter.display_name} ${o.parameter.units}`).join(', ')}</td>
                </tr>
              </tbody>
            </table>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div class={style['location-measurements']}></div>
    </A>
    <button
        class={style['location-card-delete-btn']}
        type="button"
        onClick={() => {
          setDeleteListLocationsId(props.id);
          toggleDeleteListLocationModalOpen();
        }}
      >
        <img
          src="/svgs/delete_forever_smoke120.svg"
          alt="delete forever icon"
        />
      </button>
    </li>

  );
}


export function LocationList(props: LocationListItems) {
  return (
    <ul class={style['location-list']}>
      <Show when={props.locations.length > 0} fallback={<NoLocationsFallback/>}>
      <For
        each={props.locations}
      >
        {(locationListItem) => (
          <LocationListItem {...locationListItem} />
        )}
      </For>
      </Show>

    </ul>
  );
}
