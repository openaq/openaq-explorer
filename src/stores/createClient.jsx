import dayjs from 'dayjs/esm/index.js';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const API_ROOT = import.meta.env.VITE_API_BASE_URL;

export default function createClient([state, actions]) {
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
    getAll: () => send('get', `/v3/parameters`, undefined, 'results'),
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
    get: (downloadFilters) => {
      const { locationsId, parameters, dateFrom, dateTo } =
        downloadFilters;
      const offset = (new Date().getTimezoneOffset() / 60) * -1;
      const datetimeStart = dayjs(dateFrom)
        .utcOffset(offset, true)
        .format();
      const datetimeEnd = dayjs(dateTo)
        .utcOffset(offset, true)
        .format();
      const parameterParams = parameters
        .map((o) => `parameter=${o}`)
        .join('&');
      return send(
        'get',
        `/v3/measurementsv2?limit=1000&location_id=${locationsId}&${parameterParams}&date_from=${datetimeStart}&date_to=${datetimeEnd}`,
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
        `/v2/measurements?limit=1000&location_id=${locationId}&date_from=${datetimeStart}&date_to=${datetimeEnd}`,
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
    Parameters,
    Trends,
    Providers,
  };
}
