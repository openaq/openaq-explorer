const API_ROOT = 'https://api.openaq.org';

export default function createClient([state, actions]) {
  async function send(method, url, data, resKey, idx) {
    const headers = {},
      opts = { method, headers };

    if (data !== undefined) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(API_ROOT + url, opts);
      const json = await response.json();
      const res = resKey ? json[resKey] : json;
      console.log;
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
      send('get', `/v2/locations/${id}`, undefined, 'results', 0),
  };

  const Parameters = {
    getAll: () => send('get', `/v2/parameters`, undefined, 'results'),
  };

  const Measurements = {
    getRecent: ({ locationId, parameter }) =>
      send(
        'get',
        `/v2/measurements?location_id${locationId}&parameter=${parameter}&limit=24&order=desc`,
        undefined,
        'results',
        0
      ),
  };

  return {
    Auth,
    Locations,
    Measurements,
    Parameters,
  };
}
