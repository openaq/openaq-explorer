const baseUrl = process.env.REST_API_URL || 'http://localhost:8080';

interface CreateUserDefinition {
  fullName: string;
  emailAddress: string;
  passwordHash: string;
  ipAddress: string;
}

interface UserPasswordDefinition {
  usersId: number;
  passwordHash: string;
}

interface CreateListDefinition {
  usersId: number;
  label: string;
  description: string;
}

interface UpdateListDefinition {
  listsId: number;
  label: string;
  description: string;
}

interface ListLocationDefinition {
  locationsId: number;
}

export type UserResponse = UserRow[];

export interface UserRow {
  usersId: number;
  isActive: boolean;
  emailAddress: string;
  fullname: string;
  passwordHash: string;
  token: string;
}

export const db = {
  createUser: async (user: CreateUserDefinition): Promise<Response> => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return res;
  },

  getUserById: async (usersId: number): Promise<Response> => {
    const res = await fetch(`${baseUrl}/users/${usersId}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    });
    return res;
  },

  getUserByEmailAddress: async (emailAddress: string): Promise<Response> => {
    const res = await fetch(`${baseUrl}/users/email/${emailAddress}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    });
    return res;
  },

  getUserByVerificationCode: async (
    verificationCode: string
  ): Promise<Response> => {
    const res = await fetch(
      `${baseUrl}/users/verification-code/${verificationCode}`,
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store',
        },
      }
    );
    return res;
  },

  verifyUser: async (usersId: number): Promise<Response> => {
    const res = await fetch(`${baseUrl}/users/${usersId}/verification`, {
      method: 'PATCH',
    });
    return res;
  },

  createNewUserToken: async (usersId: number): Promise<Response> => {
    const res = await fetch(`${baseUrl}/users/${usersId}/token`, {
      method: 'POST',
    });
    return res;
  },

  updateUserPassword: async (
    user: UserPasswordDefinition
  ): Promise<Response> => {
    const res = await fetch(`${baseUrl}/users/password`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return res;
  },

  createList: async (list: CreateListDefinition): Promise<Response> => {
    const res = await fetch(`${baseUrl}/lists`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    });
    return res;
  },

  getList: async (listsId: number): Promise<Response> => {
    const res = await fetch(`${baseUrl}/lists/${listsId}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    });
    return res;
  },

  updateList: async (list: UpdateListDefinition): Promise<Response> => {
    const res = await fetch(`${baseUrl}/lists`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    });
    return res;
  },

  deleteList: async (listsId: number): Promise<Response> => {
    const res = await fetch(`${baseUrl}/lists/${listsId}`, {
      method: 'DELETE',
    });
    return res;
  },

  deleteListLocation: async (
    listsId: number,
    locationsId: number
  ): Promise<Response> => {
    const res = await fetch(
      `${baseUrl}/lists/${listsId}/locations/${locationsId}`,
      {
        method: 'DELETE',
      }
    );
    return res;
  },

  getUserLists: async (usersId: number): Promise<Response> => {
    const res = await fetch(`${baseUrl}/users/${usersId}/lists`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    });
    return res;
  },

  getLocationLists: async (
    usersId: number,
    locationsId: number
  ): Promise<Response> => {
    const res = await fetch(
      `${baseUrl}/users/${usersId}/locations/${locationsId}/lists`,
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store',
        },
      }
    );
    return res;
  },
  getListLocations: async (listsId: number): Promise<Response> => {
    const res = await fetch(`${baseUrl}/lists/${listsId}/locations`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    });
    return res;
  },

  createListLocation: async (
    listsId: number,
    listLocation: ListLocationDefinition
  ): Promise<Response> => {
    const res = await fetch(`${baseUrl}/lists/${listsId}/locations`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listLocation),
    });
    return res;
  },
};
