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

/*
export interface SensorDefinition {
  id: number;
  name: string;
  parameter: ParameterDefinition;
}

export interface ParameterDefinition {
  id: number;
  name: string;
  units: string;
  valueLast: number;
  displayName: string;
  datetimeLast: string;
}
*/

/*
export interface LocationListItemDefinition {
  id: number;
  name: string;
  country: string;
  timezone: string;
  isMonitor: boolean;
  provider: string;
  sensors: SensorDefinition[];
  parameterIds: number[];
}
*/

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

export interface ListItemDefinition {
  id: number;
  name: string;
  country: string;
  ismonitor: boolean;
  provider: string;
  sensors: SensorDefinition[];
  parameterIds: number[];
}

// ------------------------------------------------------------------------

export interface LocationListItemDefinition {
  id: number;
  name: string;
  locality: string;
  timezone: string;
  country: CountryDefinition;
  owner: OwnerDefinition;
  provider: ProviderDefinition;
  isMobile: boolean;
  isMonitor: boolean;
  instruments: InstrumentDefinition[];
  sensors: SensorDefinition[];
  coordinates: CoordinatesDefinition;
  licenses: LicenseDefinition[];
  bounds: number[];
  distance: any;
  datetimeFirst: DatetimeFirstDefinition;
  datetimeLast: DatetimeLastDefinition;
  parameterIds: number[];
}

export interface CountryDefinition {
  id: number;
  code: string;
  name: string;
}

export interface OwnerDefinition {
  id: number;
  name: string;
}

export interface ProviderDefinition {
  id: number;
  name: string;
}

export interface InstrumentDefinition {
  id: number;
  name: string;
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
  valueLast: number;
  displayName: string;
  datetimeLast: string;
}

export interface CoordinatesDefinition {
  latitude: number;
  longitude: number;
}

export interface LicenseDefinition {
  id: number;
  name: string;
  attribution: AttributionDefinition;
  dateFrom: string;
  dateTo: any;
}

export interface AttributionDefinition {
  name: string;
  url: any;
}

export interface DatetimeFirstDefinition {
  utc: number;
  local: string;
}

export interface DatetimeLastDefinition {
  utc: number;
  local: string;
}



// ------------------------------------------------------------------------

export interface Root {
  id: number;
  code: string;
  name: string;
}

export interface Meta {
  name: string;
  website: string;
  page: number;
  limit: number;
  found: number;
}

export interface GenericResponse<ResourceType> {  
	meta: Meta;  
	results: ResourceType[];  
}

export interface LocationsListResponse extends GenericResponse<LocationListItemDefinition> {

}