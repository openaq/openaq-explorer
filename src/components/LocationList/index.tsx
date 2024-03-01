import { A } from '@solidjs/router';
import { For, Show, createEffect, createSignal } from 'solid-js';
import style from './LocationList.module.scss';
import {
  ReferenceGradeMarker,
  LowCostSensorMarker,
} from '../LocationMarker';
import { NoLocationsFallback } from './NoLocationsFallback';
import { useStore } from '~/stores';
import LineChart from '../Charts/LineChart';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getSensorMeasurements } from '~/client';


dayjs.extend(utc);
dayjs.extend(tz);

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
  timezone: string;
  sensors: SensorDefinition[];
  parameterIds: number[];
}

interface LocationListItems {
  locations: LocationListItemDefinition[];
}





export function LocationListItem(props: LocationListItemDefinition) {
  const [
    store,
    { setDeleteListLocationsId, toggleDeleteListLocationModalOpen },
  ] = useStore();

  const [selectedSensorsId, setSelectedSensorsId] = createSignal<number>();

  const [loading, setLoading] = createSignal(true);


  const getLocationSensorsId = (): number | undefined => {
    const sensor = props.sensors.filter(o => Number(o.parameter.id) === Number(store.listParametersId) );
    return sensor?.[0]?.id
  }

  const [measurements, setMeasurements] = createSignal([]);

  createEffect(async () => {
    setSelectedSensorsId(getLocationSensorsId())
    setMeasurements([]);
    if (selectedSensorsId()) {
      setMeasurements(await getSensorMeasurements(selectedSensorsId()!,dayjs
      .tz(
        Date.now() - 1000 * 60 * 60 * 24,
        props.timezone
      )
      .format(), dayjs
      .tz(Date.now(),  props.timezone)
      .format() ))
    }
    setLoading(false);

  })

  return (
    <li class={style['location-list-item']}>
      <A href={`/locations/${props.id}`}>
        <div class={style['location-info']}>
          <div class={style['location-info__title']}>
            {props.ismonitor ? (
              <ReferenceGradeMarker />
            ) : (
              <LowCostSensorMarker />
            )}
            <h3>{props.name}</h3>
          </div>
          <div class={style['location-info__body']}>
            <div>
              <div class={style['locality']}>{props.country}</div>
              <div class={style['location-characteristics']}>
                <div class="type-body-1">Provider</div>
                <div class="type-body-2">{props.provider}</div>

                <div class="type-body-1">Type</div>
                <div class="type-body-2">
                  {props.ismonitor ? 'Reference Grade' : 'Air sensor'}
                </div>

                <div class="type-body-1">Measures</div>
                <div class="type-body-2">
                  {props.sensors
                    .map(
                      (o) =>
                        `${o.parameter.display_name} ${o.parameter.units}`
                    )
                    .join(', ')}
                </div>
              </div>
            </div>

            <div class={style['location-measurements']}>
              <LineChart
                width={400}
                height={200}
                margin={60}
                xTicks={4}
                dateFrom={dayjs
                  .tz(
                    Date.now() - 1000 * 60 * 60 * 24,
                    props.timezone
                  )
                  .format()}
                dateTo={dayjs
                  .tz(Date.now(), props.timezone)
                  .format()}
                data={measurements()}
                scale={'linear'}
                loading={loading()}
                timezone={props.timezone}
                noDataMessage={`This location does not measure ${store.listParameter}`}
              />
            </div>
          </div>
        </div>
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
      <Show
        when={props.locations.length > 0}
        fallback={<NoLocationsFallback />}
      >
        <For each={props.locations}>
          {(locationListItem) => (
            <LocationListItem {...locationListItem} />
          )}
        </For>
      </Show>
    </ul>
  );
}
