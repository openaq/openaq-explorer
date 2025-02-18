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

export type SvgSymbol =
  | 'check_mantis100.svg'
  | 'warning_fire100.svg'
  | undefined;

export interface PasswordValue {
  color: Color;
  symbol: SvgSymbol;
  message: string;
}
