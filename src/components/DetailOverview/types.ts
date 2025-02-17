import { AccessorWithLatest } from "@solidjs/router";
import { SessionData } from "~/auth/session";
import { LicenseDefinition } from "../License/types";

export interface SensorsDefinition {
  name: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Owner {
  id: number;
  name: string;
}

export interface Provider {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  code: string;
  name: string;
}

export interface Parameter {
  id: number;
  name: string;
  units: string;
  displayName: string;
}

export interface Sensor {
  id: number;
  name: string;
  parameter: Parameter;
}

export interface Datetime {
  utc: string;
  local: string;
}

export interface DetailOverviewDefinition {
  user?: AccessorWithLatest<SessionData | undefined | null>;
  id: number;
  name: string;
  coordinates: Coordinates;
  country: Country;
  owner: Owner;
  provider: Provider;
  isMonitor: boolean;
  sensors: Sensor[];
  datetimeFirst: Datetime;
  datetimeLast: Datetime;
  isMobile: boolean;
  lists: any[];
  licenses?: LicenseDefinition[];
}

export interface SensorTypeDefintion {
  isMonitor: boolean;
}
