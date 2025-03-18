import { createSignal, For } from 'solid-js';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getSensorMeasurementsDownload } from '~/client';

import { useLocation, A } from '@solidjs/router';

import '~/assets/scss/components/download-card.scss';
import { Sensor } from '../DetailOverview/types';
import DownloadIcon from '~/assets/imgs/cloud_download.svg';

dayjs.extend(utc);
dayjs.extend(tz);

function downloadFile(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);
  element.setAttribute('target', '_blank');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function measurementsCsv(location, data) {
  const results = JSON.parse(JSON.stringify(data));
  const values = results.map((o) => {
    return {
      location_id: location.id,
      location_name: location.name,
      parameter: o.parameter.name,
      value: o.value,
      unit: o.parameter.units,
      datetimeUtc: o.period.datetimeTo.utc,
      datetimeLocal: o.period.datetimeTo.local,
      timezone: location.timezone,
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      country_iso: location.country.iso,
      isMobile: o.isMobile,
      isMonitor: o.isMonitor,
      owner_name: location.owner.name,
      provider: location.provider.name,
    };
  });
  const fields = Object.keys(values[0]);
  const replacer = (_, value) => (value === null ? '' : value);
  let csv = values.map((row) =>
    fields
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(',')
  );
  csv.unshift(fields.join(','));
  csv = csv.join('\r\n');
  return csv;
}

export function NotLoggedInFallback() {
  const pageLocation = useLocation();

  return (
    <div>
      <span class="type-body-3">
        <A
          href={`/register?redirect=${pageLocation.pathname}#download-card`}
          class="text-ocean-120"
        >
          Sign up
        </A>{' '}
        or{' '}
        <A
          href={`/login?redirect=${pageLocation.pathname}#download-card`}
          class="text-ocean-120"
        >
          login
        </A>{' '}
        to download data from this location.
      </span>
    </div>
  );
}

interface Props {
  id: number;
  timezone: string;
  sensors: Sensor[];
}

export function DownloadCard(props: Props) {
  const svgAttributes = {
    width: 32,
    height: 32,
    fill: '##33a3a1',
  };
  const [downloading, setDownloading] = createSignal(false);

  const [formDisabled, setFormDisabled] = createSignal(false);

  const [minDateFromValue, setMinDateFromValue] = createSignal(
    dayjs(new Date() - 86400000, props.timezone).format('YYYY-MM-DD')
  );
  const [dateFrom, setDateFrom] = createSignal();
  const [maxDateToValue, setMaxDateToValue] = createSignal(
    dayjs(new Date(), props.timezone).format('YYYY-MM-DD')
  );
  const [dateTo, setDateTo] = createSignal();

  const onDateFromInput = async (e) => {
    setDateFrom(e.target.value);
    setMaxDateToValue(new Date(dateFrom));
  };

  const onDateToInput = async (e) => {
    setDateTo(e.target.value);
    const minDateFrom = dayjs(
      new Date(dateTo()) - 1000 * 60 * 60 * 24 * 30,
      props.timezone
    ).format('YYYY-MM-DD');
    setMinDateFromValue(new Date(minDateFrom));
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const formElements = e.target.elements;
    const tz = formElements[0].value;
    const dateFromValue = formElements[1].value;
    const dateToValue = formElements[2].value;
    const sensorInputs = [...formElements]
      .filter((o) => o.id.includes('checkbox-sensor'))
      .filter((o) => o.checked);
    const sensorIds = sensorInputs.map((o) =>
      Number(o.id.replace('checkbox-sensor-', ''))
    );
    let data = [];
    for (const sensorId of sensorIds) {
      const measurements = await getSensorMeasurementsDownload(
        sensorId,
        dayjs(new Date(dateFromValue), props.timezone).toISOString(),
        dayjs(new Date(dateToValue), props.timezone).toISOString()
      );
      data = data.concat(measurements);
      await sleep(300);
    }
    const csvData = measurementsCsv(props, data);
    downloadFile(`openaq_location_${props.id}_measurments.csv`, csvData);
    setDownloading(false);
  };

  return (
    <>
      <h3 class="type-subtitle-1 text-sky-120">Download Data CSV</h3>
      <span class="type-body-1 text-smoke-120">
        Data downloads on OpenAQ Explorer are limited to 1000 records per
        parameter or 30 days, whichever is larger. For larger downloads use the
        OpenAQ API. Read more about the OpenAQ API at{' '}
        <a
          href="https://docs.openaq.org"
          target="_blank"
          rel="noreferrer noopener"
        >
          https://docs.openaq.org
        </a>
      </span>

      <form
        method="post"
        class="download-form"
        onSubmit={(e) => {
          onFormSubmit(e);
        }}
      >
        <input type="hidden" name="timezone" value={props.timezone} />
        <label for="">Start date</label>
        <input
          type="date"
          name="date-from"
          id="date-from-input"
          value={dayjs(+new Date() - 86400000, props.timezone).format(
            'YYYY-MM-DD'
          )}
          max={dayjs(new Date(), props.timezone).format('YYYY-MM-DD')}
          onInput={onDateFromInput}
          class="date-input"
        />
        <label for="">End date</label>
        <input
          type="date"
          name="date-to"
          id="date-to-input"
          value={dayjs(new Date(), props.timezone).format('YYYY-MM-DD')}
          max={dayjs(new Date(), props.timezone).format('YYYY-MM-DD')}
          onInput={onDateToInput}
          class="date-input"
        />
        <div class="parameter-inputs">
          <For each={props.sensors}>
            {(sensor) => (
              <>
                <label for="">
                  {sensor.parameter.displayName} {sensor.parameter.units}
                </label>
                <input
                  checked
                  type="checkbox"
                  class="checkbox"
                  name={`checkbox-sensor-${sensor.id}`}
                  id={`checkbox-sensor-${sensor.id}`}
                />
              </>
            )}
          </For>
        </div>
        <button
          type="submit"
          class={`icon-btn btn-secondary ${
            downloading() ? 'btn-secondary--disabled' : ''
          }`}
          disabled={downloading() ? true : false}
        >
          Download CSV <DownloadIcon class="download-icon" {...svgAttributes} />
        </button>
      </form>
    </>
  );
}
