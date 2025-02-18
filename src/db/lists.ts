import { action, query, redirect } from '@solidjs/router';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ListDefinition, ListItemDefinition } from './types';
import { db } from '~/client/backend';
import { getSessionUser } from '~/auth/session';

dayjs.extend(utc);

export const getUserLists = query(async (): Promise<ListDefinition[]> => {
  'use server';
  try {
    const session = await getSessionUser();
    const usersId = session?.usersId;
    if (!usersId) {
      throw redirect(`/login`);
    }
    const res = await db.getUserLists(usersId);
    if (res.status !== 200) {
      throw new Error();
    }
    const lists = await res.json();
    return lists as ListDefinition[];
  } catch (err) {
    console.error(err);
    return [];
  }
}, 'get-user-lists');

export const getList = query(
  async (listsId: number): Promise<ListDefinition> => {
    'use server';

    try {
      const session = await getSessionUser();
      const usersId = session?.usersId;
      if (!usersId) {
        throw redirect(`/login`);
      }
      const res = await db.getList(listsId);
      const rows = await res.json();
      if (rows.length === 0) {
        throw new Error('List not found');
      }
      const list = rows[0] as ListDefinition;
      if (list.ownersId !== usersId) {
        throw redirect('/lists');
      }
      return list;
    } catch {
      throw redirect('/login');
    }
  },
  'get-list'
);

export const listLocations = query(
  async (listsId: number): Promise<ListItemDefinition[]> => {
    'use server';

    try {
      const session = await getSessionUser();
      const usersId = session?.usersId;
      if (!usersId) {
        throw redirect(`/login`);
      }
      const res = await db.getListLocations(listsId);
      const lists = (await res.json()) as ListItemDefinition[];
      return lists;
    } catch {
      throw redirect('/login');
    }
  },
  'list-locations'
);

export const sensorNodeLists = query(
  async (sensorNodesId: number): Promise<ListDefinition[]> => {
    'use server';
    try {
      const session = await getSessionUser();
      const usersId = session?.usersId;
      if (!usersId) {
        throw redirect(`/login`);
      }
      const res = await db.getLocationLists(usersId, sensorNodesId);
      const lists = await res.json();
      return lists;
    } catch {
      return [];
    }
  },
  'sensor-node-lists'
);

export const createList = action(async (formData: FormData) => {
  'use server';
  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (!usersId) {
    throw redirect(`/login`);
  }
  const label = String(formData.get('list-name'));
  const description = String(formData.get('list-description'));
  if (!label || label == '') {
    throw Error('Name required');
  }
  let newList;
  try {
    const res = await db.createList({
      usersId,
      label,
      description,
    });
    newList = await res.json();
  } catch (err) {
    console.error(`create list failed: ${err}`);
    return new Error('Failed to create list');
  }
  throw redirect(`/lists/${newList.create_list}`);
}, 'create-list-action');

export const updateList = action(async (formData: FormData) => {
  'use server';
  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (!usersId) {
    throw redirect(`/login`);
  }
  const listsId = Number(formData.get('lists-id'));
  const label = String(formData.get('list-name'));
  const description = String(formData.get('list-description'));
  try {
    await db.updateList({
      listsId,
      label,
      description,
    });
  } catch (err) {
    console.error(`update list failed: ${err}`);
    return new Error('Failed to update list');
  }
  throw redirect(`/lists/${listsId}`, {
    revalidate: getUserLists.keyFor()[listsId],
  });
}, 'update-list-action');

export const deleteList = action(async (formData: FormData) => {
  'use server';
  const listsId = Number(formData.get('lists-id'));
  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (!usersId) {
    throw redirect(`/login`);
  }
  try {
    await db.deleteList(listsId);
  } catch (err) {
    console.error(`delete list failed: ${err}`);
    return new Error('Failed to delete list');
  }
  throw redirect(`/lists`, { revalidate: getUserLists.keyFor()[listsId] });
}, 'delete-list-action');

export const getLocationById = query(async (locationsId: number) => {
  'use server';
  const url = new URL(import.meta.env.VITE_API_BASE_URL);
  url.pathname = `/v3/locations/${locationsId}`;

  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${import.meta.env.VITE_EXPLORER_API_KEY}`,
    },
  });
  const data = await res.json();
  return data.results[0];
}, 'get-location-by-id-action');

export const removeSensorNodesList = action(
  async (listsId: number, sensorNodesId: number) => {
    'use server';
    const session = await getSessionUser();
    const usersId = session?.usersId;
    if (!usersId) {
      throw redirect(`/login`);
    }
    try {
      await db.deleteListLocation(listsId, sensorNodesId);
    } catch (err) {
      console.error(`create list location failed: ${err}`);
      return new Error('Failed to create list location');
    }
    throw redirect(`/lists/${listsId}`, {
      revalidate: getUserLists.keyFor[listsId],
    });
  },
  'remove-sensor-node-list-action'
);

export const addRemoveSensorNodesList = action(async (formData: FormData) => {
  'use server';

  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (!usersId) {
    throw redirect(`/login`);
  }
  const redirectTo = String(formData.get('redirect'));
  const sensorNodesId = Number(formData.get('sensor-nodes-id'));
  for (const [k, v] of formData.entries()) {
    if (k.includes('list-')) {
      const listsId = Number(k.split('-')[1]);
      const isOn = Number(v) == 1;
      const res = await db.getListLocations(listsId);
      const locations = (await res.json()) as ListItemDefinition[];
      const locationIds = locations.map((o) => o.id);
      if (locationIds.indexOf(sensorNodesId) === -1 && isOn) {
        try {
          await db.createListLocation(listsId, { locationsId: sensorNodesId });
        } catch (err) {
          console.error(`create list location failed: ${err}`);
          return new Error('Failed to create list location');
        }
        throw redirect(`/lists/${listsId}`);
      }
      if (locationIds.indexOf(sensorNodesId) !== -1 && !isOn) {
        try {
          await db.deleteListLocation(listsId, sensorNodesId);
        } catch (err) {
          console.error(`delete list failed: ${err}`);
          return new Error('Failed to delete list location');
        }
        throw redirect(redirectTo);
      }
    }
  }
}, 'add-remove-sensor-node-list-action');

export const deleteListLocation = action(async (formData: FormData) => {
  'use server';
  const listsId = Number(formData.get('lists-id'));
  const locationsId = Number(formData.get('locations-id'));
  const session = await getSessionUser();
  const usersId = session?.usersId;
  if (!usersId) {
    throw redirect(`/login`);
  }
  try {
    await db.deleteListLocation(listsId, locationsId);
  } catch (err) {
    console.error(`delete list failed: ${err}`);
    return new Error('Failed to delete list');
  }
  throw redirect(`/lists/${listsId}`);
}, 'delete-list-location-action');
