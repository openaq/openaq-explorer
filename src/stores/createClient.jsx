// import dayjs from 'dayjs/esm/index.js';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const API_ROOT = import.meta.env.VITE_API_BASE_URL;

export default function createClient([actions]) {
  async function send(
    method,
    url,
    data,
    resKey,
    idx,
    url_root = API_ROOT
  ) {
    const headers = {},
      opts = { method, headers };

    if (data !== undefined) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url_root + url, opts);
      const json = await response.json();
      const res = resKey ? json[resKey] : json;
      return idx != undefined ? res[idx] : res;
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        actions.logout();
      }
      return err;
    }
  }

  const Auth = {
    current: () => send('get', '/users/keys/'),
    login: (email, password) =>
      send('post', '/login', { user: { email, password } }),
    register: (username, email, password) =>
      send('post', '/register', {
        user: { username, email, password },
      }),
  };

  const Locations = {
    get: (id) =>
      send('get', `/v3/locations/${id}`, undefined, 'results', 0),
  };

  const Parameters = {
    getAll: () =>
      send(
        'get',
        `/v3/parameters?parameter_type=pollutant`,
        undefined,
        'results'
      ),
  };

  const Providers = {
    getAll: () =>
      send('get', `/v3/providers?limit=1000`, undefined, 'results'),
  };

  const Trends = {
    get: (params) => {
      const { sensorNodesId, measurandsId, period } = params;
      return send(
        'get',
        `/v3/locations/${sensorNodesId}/trends/${measurandsId}?period_name=${period}`,
        undefined,
        'results'
      );
    },
  };

  const Measurements = {
    get: (params) => {
      const { locationsId, parameter, dateFrom, dateTo } = params;

      const offset = (new Date().getTimezoneOffset() / 60) * -1;
      const datetimeStart = dayjs(dateFrom)
        .utcOffset(offset, true)
        .format();
      const datetimeEnd = dayjs(dateTo)
        .utcOffset(offset, true)
        .format();
      const parameterParams = `parameters_id=${parameter}`;
      return send(
        'get',
        `/v3/locations/${locationsId}/measurements?period_name=hour&limit=1000&${parameterParams}&date_from=${datetimeStart}&date_to=${datetimeEnd}`,
        undefined,
        'results',
        undefined
      );
    },

    getRecent: (locationId) => {
      const dateTo = new Date();
      const dateFrom = new Date(
        Date.now() - 86400 * 1000
      ).toISOString();

      const offset = (new Date().getTimezoneOffset() / 60) * -1;
      const datetimeStart = dayjs(dateFrom)
        .utcOffset(offset, true)
        .format();
      const datetimeEnd = dayjs(dateTo)
        .utcOffset(offset, true)
        .format();
      return send(
        'get',
        `/v3/locations/${locationId}/measurements?period_name=hour&limit=1000&date_from=${datetimeStart}&date_to=${datetimeEnd}`,
        undefined,
        'results',
        undefined
      );
    },
  };

  const Downloads = {
    get: (props) => {
      const offset = (new Date().getTimezoneOffset() / 60) * -1;
      const datetimeStart = dayjs(props.dateFrom)
        .utcOffset(offset, true)
        .format();
      const datetimeEnd = dayjs(props.dateTo)
        .utcOffset(offset, true)
        .format();
      let parameterParams = '';
      if (props.parameters) {
        parameterParams = props.parameters
          .map((o) => `parameters_id=${o}`)
          .join('&');
        parameterParams = `&${parameterParams}`;
      }

      return send(
        'get',
        `/v2/measurements?location_id=${props.locationsId}&limit=1000${parameterParams}&date_from=${datetimeStart}&date_to=${datetimeEnd}`,
        undefined,
        'results',
        undefined,
        'https://api.openaq.org'
      );
    },
  };

  return {
    Auth,
    Locations,
    Measurements,
    Downloads,
    Parameters,
    Trends,
    Providers,
  };
}
