import { useSearchParams, useSubmission } from '@solidjs/router';
import { forgotPasswordAction } from '~/db';
import { Show, createSignal } from 'solid-js';
import PasswordScore from '~/components/PasswordScore';
import { evaluatePassword } from '~/lib/password';

import '~/assets/scss/routes/new-password.scss';
import { Header } from '~/components/Header';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const settingNewPassword = useSubmission(forgotPasswordAction);

  const [passwordInputValue, setPasswordInputValue] = createSignal<string>();
  const [passwordConfirmInputValue, setPasswordConfirmInputValue] =
    createSignal<string>();

  const [passwordScore, setPasswordScore] = createSignal();
  const [passwordWarning, setPasswordWarning] = createSignal();
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] =
    createSignal('');

  let passwordInputTimeout: number;

  const onPasswordInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setPasswordInputValue(target.value);
    clearTimeout(passwordInputTimeout);
    passwordInputTimeout = window.setTimeout(() => {
      const result = evaluatePassword(target.value);
      if (target.value !== '') {
        setPasswordScore(result.score);
        setPasswordWarning(result.feedback.warning);
      } else {
        setPasswordScore(-1);
        setPasswordWarning('');
      }
    }, 500);
  };

  let passwordConfirmInputTimeout: number;

  const onPasswordConfirmInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setPasswordConfirmInputValue(target.value);
    clearTimeout(passwordConfirmInputTimeout);
    passwordConfirmInputTimeout = window.setTimeout(() => {
      if (passwordInputValue() !== passwordConfirmInputValue()) {
        setPasswordsDoNotMatch('passwords must match');
      } else {
        setPasswordsDoNotMatch('');
      }
    }, 500);
  };


  return (
    <>
      <Header />
      <main class='main'>
        <h1 class="type-heading-1 text-sky-120">
          Forgot your password?
        </h1>
        <form
          action={forgotPasswordAction}
          method="post"
          class='new-password-form'
        >
          <input type="hidden" name="verification-code" value={searchParams.code} />
          <div class='form-element'>
            <label for="new-password">New password</label>
            <input
              class="text-input"
              type="password"
              name="new-password"
            />
          </div>
          <div class='form-element'>
            <label for="confirm-new-password">
              Confirm new password
            </label>
            <input
              class="text-input"
              type="password"
              name="confirm-new-password"
            />
          </div>
          <Show when={settingNewPassword.result}>
            <p
              role="alert"
              id="error-message"
              class='error-message'
            >
              <img src="/svgs/error_fire100.svg" alt="error icon" />
              {settingNewPassword.result!.message}
            </p>
          </Show>
          <button class="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        <div class='bubble-lg' />
        <div class='bubble-sm' />
      </main>
      </>
  );
}
