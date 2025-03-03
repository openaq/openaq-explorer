import { Match, Show, Switch } from 'solid-js';
import {
  StrengthBarDefinition,
  PasswordScoreDefinition,
  Color,
  PasswordValue,
} from './types';

import '~/assets/scss/components/password-score.scss';

import ErrorIcon from '~/assets/imgs/warning.svg';
import CheckIcon from '~/assets/imgs/check.svg';

function passwordValues(score: number): PasswordValue {
  let color: Color;
  let message: string;
  switch (score) {
    case 0:
      color = 'warning';
      message = `Very weak password`;
      break;
    case 1:
      color = 'warning';
      message = `Weak password`;
      break;
    case 2:
      color = 'alert';
      message = `Somewhat secure password`;
      break;
    case 3:
      color = 'ok';
      message = 'Strong password';
      break;
    case 4:
      color = 'ok';
      message = 'Very strong password';
      break;
    default:
      color = 'warning';
      message = '';
  }
  return {
    color: color,
    message: message,
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

export default function PasswordScore(props: PasswordScoreDefinition) {


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
          <Switch fallback={''}>
            <Match when={props.score! < 3}>
              <ErrorIcon fill="#dd443c"/>
            </Match>
            <Match when={props.score! >= 3}>
              <CheckIcon fill="#89c053" />
            </Match>
          </Switch>
        </span>
        <span class="type-body-1">{props.warning}</span>
      </div>
    </div>
  );
}
