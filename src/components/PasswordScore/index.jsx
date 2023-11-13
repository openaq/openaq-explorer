function ErrorSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 -960 960 960"
    >
      <path
        fill="#dd443c"
        d="M480-280q17 0 29-11t11-29q0-17-11-28t-29-12q-17 0-28 12t-12 28q0 17 12 29t28 11Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
      />
    </svg>
  );
}

function CheckSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 -960 960 960"
    >
      <path
        fill="#89c053"
        d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
      />
    </svg>
  );
}

function passwordValues(score) {
  let color;
  let message;
  let symbol;
  switch (score) {
    case 0:
      color = 'warning';
      symbol = <ErrorSvg />;
      message = `Very weak password`;
      break;
    case 1:
      color = 'warning';
      symbol = <ErrorSvg />;
      message = `Weak password`;
      break;
    case 2:
      color = 'alert';
      symbol = <ErrorSvg />;
      message = `Somewhat secure password`;
      break;
    case 3:
      color = 'ok';
      message = 'Strong password';
      symbol = <CheckSvg />;
      break;
    case 4:
      color = 'ok';
      message = 'Very strong password';
      symbol = <CheckSvg />;
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

function StrengthBar(props) {
  return (
    <div
      class={
        props.index + 1 <= props.score
          ? `strength-meter__bar strength-meter__bar--${props.color}`
          : 'strength-meter__bar'
      }
    ></div>
  );
}

export default function PasswordScore(props) {
  return (
    <div class="password-strength">
      <div class="strenth-meter">
        <span class="type-body-1">Password strength</span>
        <div class="strength-meter-bars">
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
        <span class="type-body-2 strenth-message js-strength-message">
          {passwordValues(props.score).message}
          {passwordValues(props.score).symbol}
        </span>
        <span class="type-body-1 js-strength-warning">
          {props.warning}
        </span>
      </div>
    </div>
  );
}
