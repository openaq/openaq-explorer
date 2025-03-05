export interface StrengthBarDefinition {
  index: number;
  score: number;
  color: string;
}

export interface PasswordScoreDefinition {
  score: number | undefined;
  warning: string | undefined;
}

export type Color = 'warning' | 'alert' | 'ok';


export interface PasswordValue {
  color: Color;
  message: string;
}
