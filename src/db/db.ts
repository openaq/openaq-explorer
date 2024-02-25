import postgres from 'postgres';
import { encode } from '~/lib/auth';

const sql = postgres({
  host: import.meta.env.VITE_DB_HOST,
  port: import.meta.env.VITE_DB_PORT,
  database: import.meta.env.VITE_DB_DATABASE,
  username: import.meta.env.VITE_DB_USER,
  password: import.meta.env.VITE_DB_PASSWORD,
});

interface ListDefinition {
  listsId: number;
  ownersId: number;
  usersId: number;
  role: string;
  label: string;
  description: string;
  visibility: boolean;
  userCount: number;
  locationsCount: number;
  sensorNodesIds: number[];
  bbox: number[][];
}

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

interface CreateListDefinition {
  create_list: number
}

interface ModifySensorNodesListDefinition {
  sensor_nodes_list_id: number
}


interface GetUserDefinition {
  usersId: number;
  passwordHash: string;
  active: boolean;
}

interface UserByVerificationCodeDefinition {
  usersId : number; 
  active : boolean;
  expiresOn: string;
  emailAddress: string;
}

interface CreateUserDefinition {
  token : string;
}

interface UserByIdDefinition {
  usersId : number; 
  active : boolean;
  emailAddress: string;
  fullName: string;
  passwordHash: string;
  token :string;
}

interface UpdateTokenDefintion {
  newToken: string;
}

export const db = {
  user: {
    async getUserById(usersId: number) {
      const user = await sql<UserByIdDefinition[]>`
            SELECT
                users_id AS "usersId"
                , CASE
                  WHEN verified_on IS NULL THEN false
                  ELSE true
                END as active
                , email_address AS "emailAddress"
                , e.full_name AS "fullName"
                , u.password_hash AS "passwordHash"
                , uk.token
            FROM 
                users u
            JOIN 
                users_entities ue USING (users_id)
            JOIN 
                entities e USING (entities_id)
            JOIN 
                user_keys uk USING (users_id)
            WHERE users_id = ${usersId}`;
      return user;
    },
    async getUser(email: string) {
      const user = await sql<GetUserDefinition[]>`
                SELECT
                    users_id AS "usersId"
                    , password_hash AS "passwordHash"
                    , CASE
                        WHEN verified_on IS NULL THEN false
                        ELSE true
                    END as active
                FROM 
                    users
                WHERE 
                    email_address = ${email}
            `;
      return user;
    },
    async create(
      fullName: string,
      emailAddress: string,
      passwordHash: string,
      ipAddress: string | undefined
    ) {
      if (!ipAddress) {
        ipAddress = '0.0.0.0';
      }
      try {
        const user = await sql<CreateUserDefinition[]>`
                SELECT * FROM create_user(
                    ${fullName}
                    , ${emailAddress}
                    , ${passwordHash}
                    , ${ipAddress}
                    , 'Person'
                )`;
        return user;
      } catch (err) {
        return err as Error;
      }
    },
    async changePassword(usersId: number, passwordHash: string) {
      await sql`
      UPDATE 
        users
      SET 
        password_hash = ${passwordHash}
      WHERE 
        users_id = ${usersId}`;
    },
    async getUserByVerificationCode(verificationCode: string) {
      const user = await sql<UserByVerificationCodeDefinition[]>`
      SELECT
          users.users_id AS "usersId"
          , CASE
            WHEN verified_on IS NULL THEN false
            ELSE true
          END as active
          , users.expires_on AS "expiresOn"
          , users.email_address AS "emailAddress"
      FROM
          users
      WHERE
          verification_code = ${verificationCode}
      `;
      return user
    },
    async verifyUserEmail(usersId: number) {
      await sql`
        SELECT * FROM get_user_token(${usersId})
      `;
    },
    async regenerateKey(usersId: number) {
      try {
        const token = await sql<UpdateTokenDefintion[]>`
        UPDATE 
          user_keys
        SET 
          token = generate_token()
        WHERE 
          users_id = ${usersId}
        RETURNING token AS "newToken";
      `;
      return token;
      } catch (err) {
        return err as Error
      }

    },
  },

  lists: {
    async createList(usersId: number, label: string, description: string) {
      const listsId = await sql<CreateListDefinition[]>`
        SELECT create_list(${usersId}, ${label}, ${description}) 
      `
      return listsId
    },
    async updateList(listsId: number, label: string, description: string) {
       await sql<CreateListDefinition[]>`
       UPDATE 
        lists 
       SET 
        label = ${label}, description = ${description} 
       WHERE 
        lists_id = ${listsId};`
    },
    async deleteList(listsId: number) {
      await sql`
      SELECT delete_list(${listsId})
      `
    },
    async deleteListLocation(listsId: number, locationsId: number) {
      await sql`
      DELETE FROM 
        sensor_nodes_list
      WHERE 
        lists_id = ${listsId} AND sensor_nodes_id = ${locationsId};
      `
    },
    async getListsByUserId(usersId: number) {
      const lists = await sql<ListDefinition[]>`
        SELECT
            lists_id AS "listsId"
            , users_id AS "ownersId"
            , users_id AS "usersId"
            , role
            , label
            , description
            , visibility
            , user_count AS "userCount"
            , locations_count AS "locationsCount"
            , sensor_nodes_ids AS "sensorNodesIds"
            , bbox
        FROM
            user_lists_view
        WHERE
            users_id = ${usersId}`;
      return lists;
    },
    async getListById(usersId: number, listsId: number) {
      const list = await sql<ListDefinition[]>`
        SELECT
            lists_id AS "listsId"
            , users_id AS "ownersId"
            , users_id AS "usersId"
            , role
            , label
            , description
            , visibility
            , user_count AS "userCount"
            , locations_count AS "locationsCount"
            , sensor_nodes_ids AS "sensorNodesIds"
            , bbox
        FROM
            user_lists_view
        WHERE
            lists_id = ${listsId}
        AND
            users_id = ${usersId}`;
      return list[0];
    },
    async getListsBySensorNodesId(usersId: number, sensorNodesId: number) {
      const lists = await sql<ListDefinition[]>`
        SELECT
            lists_id AS "listsId"
            , users_id AS "ownersId"
            , users_id AS "usersId"
            , role
            , label
            , description
            , visibility
            , user_count AS "userCount"
            , locations_count AS "locationsCount"
            , sensor_nodes_ids AS "sensorNodesIds"
            , bbox
        FROM
            user_lists_view
        WHERE
            ${sensorNodesId} = ANY (sensor_nodes_ids)
        AND
            users_id = ${usersId}`;
      return lists;
    },
    async getLocationsByListId(usersId: number,listsId: number) {
      const lists = await sql<LocationListItemDefinition[]>`
      SELECT 
        lvc.id
        , lvc.name
        , lvc.country->>'name' as country
        , lvc.ismonitor 
        , lvc.provider->>'name' as provider
        , lvc.sensors
        , lvc.parameter_ids
        , ul.users_id
      FROM 
        locations_view_cached lvc
      JOIN 
        sensor_nodes_list snl ON snl.sensor_nodes_id = lvc.id
      JOIN 
        user_lists_view ul USING (lists_id)	
      WHERE 
        snl.lists_id = ${listsId}
      AND 
        users_id = ${usersId}`;
      return lists;
    },
    async addSensorNodeToList(listsId: number, sensorNodesId: number) {
        const sensorNodesListId = await sql<ModifySensorNodesListDefinition[]>`
        INSERT INTO 
          sensor_nodes_list (sensor_nodes_id, lists_id)
        VALUES 
          (${sensorNodesId}, ${listsId})
        RETURNING 
          sensor_nodes_lists_id;
      `;
      return sensorNodesListId;
    },
    async removeSensorNodeToList(listsId: number, sensorNodesId: number) {
        const sensorNodesListId= await sql<ModifySensorNodesListDefinition[]>`
        DELETE FROM sensor_nodes_list 
        WHERE 
          sensor_nodes_id = ${sensorNodesId}
        AND 
          lists_id = ${listsId}
          RETURNING sensor_nodes_lists_id;
      `;
      return sensorNodesListId
    },
  },
};
