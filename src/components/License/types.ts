import { ParentProps } from 'solid-js';


export interface LicenseDefinition {
  id: number;
  name: string;
  commercialUseAllowed: boolean;
  attributionRequired: boolean;
  shareAlikeRequired: boolean;
  modificationAllowed: boolean;
  redistributionAllowed: boolean;
  sourceUrl: string;
}

export interface IconTooltipDefinition extends ParentProps{
    title: string;
}
