export interface ListDefinition {
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

export interface LocationListItemDefinition {
  id: number;
  name: string;
  country: string;
  timezone: string;
  ismonitor: boolean;
  provider: string;
  sensors: SensorDefinition[];
  parameterIds: number[];
}

export interface CreateListDefinition {
  create_list: number;
}

export interface ModifySensorNodesListDefinition {
  sensor_nodes_list_id: number;
}

export interface GetUserDefinition {
  usersId: number;
  passwordHash: string;
  active: boolean;
}

export interface UserByVerificationCodeDefinition {
  usersId: number;
  active: boolean;
  expiresOn: string;
  emailAddress: string;
}

export interface CreateUserDefinition {
  token: string;
}

export interface UserByIdDefinition {
  usersId: number;
  active: boolean;
  emailAddress: string;
  fullname: string;
  passwordHash: string;
  token: string;
}

export interface UpdateTokenDefintion {
  newToken: string;
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

export interface ListItemDefinition {
  id: number;
  name: string;
  country: string;
  ismonitor: boolean;
  provider: string;
  sensors: SensorDefinition[];
  parameterIds: number[];
}
