import { json } from '@solidjs/router';
import { GET } from '@solidjs/start';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(tz);

export async function fetchLocation(locationsId: number) {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/v3/locations/${locationsId}`;
  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
  });
  return await res.json();
}

async function fetchSensorMeasurements(
  sensorsId: number,
  datetimeFrom: string,
  datetimeTo: string,
  limit: number
) {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/v3/sensors/${sensorsId}/measurements`;
  url.search = `?date_from=${datetimeFrom.replace(
    ' ',
    '%2b'
  )}&date_to=${datetimeTo.replace(' ', '%2b')}&limit=${limit}`;
  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
  });
  const data = await res.json();
  return data.results;
}

async function fetchSensorTrends(
  sensorsId: number,
  periodName: string,
  datetimeFrom: string,
  datetimeTo: string
) {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/v3/sensors/${sensorsId}/measurements`;
  url.search = `?period_name=${periodName}&date_from=${datetimeFrom}&date_to=${datetimeTo}`;
  console.log(url.href)
  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
  });
  const data = await res.json();
  return data.results;
}

async function fetchProviders() {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/v3/providers`;
  url.search = 'limit=1000';
  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
  });
  return await res.json();
}

export const getSensorMeasurements = GET(
  async (
    sensorsId: number,
    datetimeFrom: string,
    datetimeTo: string,
    limit: number = 1000
  ) => {
    'use server';
    const data = await fetchSensorMeasurements(
      sensorsId,
      datetimeFrom,
      datetimeTo,
      limit
    );
    return json(data, { headers: { 'cache-control': 'max-age=60' } });
  }
);

interface ParameterDefinition {
  id: number;
  name: string;
  units: string;
  displayName: string;
}

interface SensorDefinition {
  id: number;
  name: string;
  parameter: ParameterDefinition;
}

export const getSensorRecentMeasurements = GET(
  async (sensor: SensorDefinition, timezone: string) => {
    'use server';
    const now = dayjs(new Date(), timezone).toISOString();
    const yesterday = dayjs(
      new Date().getTime() - 86400000,
      timezone
    ).toISOString();
    const sensorMeasurements = await fetchSensorMeasurements(
      sensor.id,
      yesterday,
      now,
      24
    );
    const series = sensorMeasurements.map((o) => {
      return {
        date: o.period.datetimeTo.local,
        value: o.value,
      };
    });
    return json({
      parameter: `${sensor.parameter.displayName} ${sensor.parameter.units}`,
      series: series,
    }, {
      headers: { 'cache-control': 'max-age=3600' },
    });
  }
);

export const getLocationRecentMeasurements = GET(
  async (locationsId: number) => {
    'use server';
    const location = await fetchLocation(locationsId);
    const sensors = location.results[0].sensors;
    const measurements = [];
    const now = dayjs(new Date(), location.timezone).toISOString();
    const yesterday = dayjs(
      new Date().getTime() - 86400000,
      location.timezone
    ).toISOString();

    for (const sensor of sensors) {
      const sensorMeasurements = await fetchSensorMeasurements(
        sensor.id,
        yesterday,
        now,
        24
      );
      const series = sensorMeasurements.map((o) => {
        return {
          date: o.period.datetimeTo.local,
          value: o.value,
        };
      });
      measurements.push({
        parameter: sensor.parameter.displayName,
        series: series,
      });
    }
    return measurements;
  }
);

export const getSensorTrends = GET(
  async (
    sensorsId: number,
    periodName: string,
    datetimeFrom: string,
    datetimeTo: string
  ) => {
    'use server';
    console.log("SENSOR TREND", sensorsId, periodName, datetimeFrom, datetimeTo)
    const data = await fetchSensorTrends(
      sensorsId,
      periodName,
      datetimeFrom,
      datetimeTo
    );
    console.log(data)
    return json(data, {
      headers: { 'cache-control': 'max-age=86400' },
    });
  }
);

export const getLocation = GET(async (locationsId: number) => {
  'use server';
  const data = await fetchLocation(locationsId);
  return json(data, { headers: { 'cache-control': 'max-age=60' } });
});

export const getProviders = GET(async () => {
  'use server';
  const data = await fetchProviders();
  return json(data, {
    headers: { 'cache-control': 'max-age=86400' },
  });
});
