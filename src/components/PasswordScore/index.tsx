import { Show } from 'solid-js';
import { StrengthBarDefinition, PasswordScoreDefinition, Color, SvgSymbol, PasswordValue } from './types';

import '~/assets/scss/components/password-score.scss';

const errorSvg = 'warning_fire100.svg' as SvgSymbol;
const checkSvg = 'check_mantis100.svg' as SvgSymbol;

function passwordValues(score: number) : PasswordValue  {
  let color: Color;
  let message: string;
  let symbol: SvgSymbol;
  switch (score) {
    case 0:
      color = 'warning';
      symbol = errorSvg;
      message = `Very weak password`;
      break;
    case 1:
      color = 'warning';
      symbol = errorSvg;
      message = `Weak password`;
      break;
    case 2:
      color = 'alert';
      symbol = errorSvg;
      message = `Somewhat secure password`;
      break;
    case 3:
      color = 'ok';
      message = 'Strong password';
      symbol = checkSvg;
      break;
    case 4:
      color = 'ok';
      message = 'Very strong password';
      symbol = checkSvg;
      break;
    default:
      color = 'warning';
      symbol = errorSvg;
      message = '';
  }
  return {
    color: color,
    message: message,
    symbol: symbol,
  };
}

export function StrengthBar(props: StrengthBarDefinition) {
  return (
    <div
      class={`strength-meter__bar ${
        props.index + 1 <= props.score
          ? `strength-meter__bar--${props.color}`
          : ''
      }`}
    ></div>
  );
}

export default function PasswordScore(
  props: PasswordScoreDefinition
) {
  return (
    <div class="password-strength">
      <div class="strength-meter-container">
        <span class="type-body-1">Password strength</span>
        <div class="strength-meter">
          <StrengthBar
            index={0}
            color={passwordValues(props.score!).color}
            score={props.score!}
          />
          <StrengthBar
            index={1}
            color={passwordValues(props.score!).color}
            score={props.score!}
          />
          <StrengthBar
            index={2}
            color={passwordValues(props.score!).color}
            score={props.score!}
          />
          <StrengthBar
            index={3}
            color={passwordValues(props.score!).color}
            score={props.score!}
          />
          <StrengthBar
            index={4}
            color={passwordValues(props.score!).color}
            score={props.score!}
          />
        </div>
      </div>
      <div>
        <Show when={props.score! < 4}>
          <span class="strength-message">
            Please choose a stronger password
          </span>
        </Show>
        <span class="strength-message">
          {passwordValues(props.score!).message}
          {passwordValues(props.score!).symbol ? (
            <img
              src={`/svgs/${passwordValues(props.score!).symbol}`}
              alt=""
            />
          ) : (
            ''
          )}
        </span>
        <span class="type-body-1">{props.warning}</span>
      </div>
    </div>
  );
}
