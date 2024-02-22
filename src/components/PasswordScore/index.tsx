import { Show, createEffect } from 'solid-js';
import style from './PasswordScore.module.scss';

const errorSvg = 'warning_fire100.svg';
const checkSvg = 'check_mantis100.svg'




function passwordValues(score: number) {
  let color;
  let message;
  let symbol;
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
      color = 'red';
      symbol = '';
      message = '';
  }
  return {
    color: color,
    message: message,
    symbol: symbol,
  };
}

interface StrengthBarDefinition {
  index: number;
  score: number;
  color: string;
}

function StrengthBar(props: StrengthBarDefinition) {


  return (
    <div
      class={`${style['strength-meter__bar']} ${
        props.index + 1 <= props.score
          ?  style[`strength-meter__bar--${props.color}`]
          : ''
      }`
      }
    ></div>
  );
}

interface PasswordScoreDefinition {
  score: number;
  warning: string;
}

export default function PasswordScore(props: PasswordScoreDefinition) {
  return (
    <div class={style["password-strength"]}>
      <div class={style["strength-meter"]}>
        <span class="type-body-1">Password strength</span>
        <div class={style["strength-meter-bars"]}>
          <StrengthBar
            index={0}
            color={passwordValues(props.score).color}
            score={props.score}
          />
          <StrengthBar
            index={1}
            color={passwordValues(props.score).color}
            score={props.score}
          />
          <StrengthBar
            index={2}
            color={passwordValues(props.score).color}
            score={props.score}
          />
          <StrengthBar
            index={3}
            color={passwordValues(props.score).color}
            score={props.score}
          />
          <StrengthBar
            index={4}
            color={passwordValues(props.score).color}
            score={props.score}
          />
        </div>
      </div>
      <div>
        <Show when={props.score < 4}>
        <span class={style["strength-message"]}>
          Please choose a stronger password
        </span>
        </Show>
        <span class={style["strength-message"]}>
          {passwordValues(props.score).message}
          {passwordValues(props.score).symbol ? <img src={`/svgs/${passwordValues(props.score).symbol }`} alt="" /> : ''}
        </span>
        <span class="type-body-1">
          {props.warning}
        </span>
      </div>
    </div>
  );
}
