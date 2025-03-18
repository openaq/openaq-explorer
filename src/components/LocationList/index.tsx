import { A } from '@solidjs/router';
import { For, Show, createEffect, createSignal } from 'solid-js';
import { ReferenceGradeMarker, LowCostSensorMarker } from '../LocationMarker';
import { NoLocationsFallback } from './NoLocationsFallback';
import { useStore } from '~/stores';
import LineChart from '~/components/Charts/LineChart';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getSensorMeasurements } from '~/client';
import DeleteForeverIcon from '~/assets/imgs/delete_forever.svg';

import '~/assets/scss/components/location-list.scss';

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
  displayName: string;
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
  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '#FFFFFF',
  };

  const [
    store,
    { setDeleteListLocationsId, toggleDeleteListLocationModalOpen },
  ] = useStore();

  const [selectedSensorsId, setSelectedSensorsId] = createSignal<number>();

  const [loading, setLoading] = createSignal(true);

  const getLocationSensorsId = (): number | undefined => {
    const sensor = props.sensors.filter(
      (o) => Number(o.parameter.id) === Number(store.listParametersId)
    );
    return sensor?.[0]?.id;
  };

  const [measurements, setMeasurements] = createSignal([]);

  createEffect(async () => {
    setSelectedSensorsId(getLocationSensorsId());
    setMeasurements([]);
    if (selectedSensorsId()) {
      setMeasurements(
        await getSensorMeasurements(
          selectedSensorsId()!,
          dayjs.tz(Date.now() - 1000 * 60 * 60 * 24, props.timezone).format(),
          dayjs.tz(Date.now(), props.timezone).format()
        )
      );
    }
    setLoading(false);
  });

  return (
    <li class="location-list-item">
      <A href={`/locations/${props.id}`}>
        <div class="location-info">
          <div class="location-info__title">
            {props.ismonitor ? (
              <ReferenceGradeMarker />
            ) : (
              <LowCostSensorMarker />
            )}
            <h3>{props.name}</h3>
          </div>
          <div class="location-info__body">
            <div>
              <div class="locality">{props.country}</div>
              <div class="location-characteristics">
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
                      (o) => `${o.parameter.displayName} ${o.parameter.units}`
                    )
                    .join(', ')}
                </div>
              </div>
            </div>

            <div class="location-measurements">
              <LineChart
                width={400}
                height={200}
                margin={60}
                xTicks={4}
                dateFrom={dayjs
                  .tz(Date.now() - 1000 * 60 * 60 * 24, props.timezone)
                  .format()}
                dateTo={dayjs.tz(Date.now(), props.timezone).format()}
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
        class="location-card-delete-btn"
        type="button"
        onClick={() => {
          setDeleteListLocationsId(props.id);
          toggleDeleteListLocationModalOpen();
        }}
      >
        <DeleteForeverIcon {...svgAttributes} />
      </button>
    </li>
  );
}

export function LocationList(props: LocationListItems) {
  return (
    <ul class="location-list">
      <Show
        when={props.locations.length > 0}
        fallback={<NoLocationsFallback />}
      >
        <For each={props.locations}>
          {(locationListItem) => <LocationListItem {...locationListItem} />}
        </For>
      </Show>
    </ul>
  );
}
