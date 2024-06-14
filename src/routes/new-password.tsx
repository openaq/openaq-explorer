import { useSearchParams, useSubmission } from '@solidjs/router';
import { forgotPasswordAction } from '~/db';
import { Show, createSignal } from 'solid-js';
import PasswordScore from '~/components/PasswordScore';
import { evaluatePassword } from '~/lib/password';

import '~/assets/scss/routes/new-password.scss';
import { Header } from '~/components/Header';
import { Score } from '@zxcvbn-ts/core/dist/types';


export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const settingNewPassword = useSubmission(forgotPasswordAction);

  const [passwordInputValue, setPasswordInputValue] =
    createSignal<string>();
  const [passwordConfirmInputValue, setPasswordConfirmInputValue] =
    createSignal<string>();

  const [passwordScore, setPasswordScore] = createSignal<Score>();
  const [passwordWarning, setPasswordWarning] =
    createSignal<string>();
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] =
    createSignal<boolean>();

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
        setPasswordScore(undefined);
        setPasswordWarning('');
      }
      if (passwordInputValue() !== passwordConfirmInputValue()) {
        setPasswordsDoNotMatch(true);
      } else {
        setPasswordsDoNotMatch(false);
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
        setPasswordsDoNotMatch(true);
      } else {
        setPasswordsDoNotMatch(false);
      }
    }, 500);
  };

  return (
    <>
      <Header />
      <main class="main">
        <h1 class="type-heading-1 text-sky-120">
          Forgot your password?
        </h1>
        <form
          action={forgotPasswordAction}
          method="post"
          class="new-password-form"
        >
          <input
            type="hidden"
            name="verification-code"
            value={searchParams.code}
          />
          <div class="form-element">
            <label for="new-password">New password</label>
            <input
              class="text-input"
              type="password"
              name="new-password"
              required
              onInput={(e) => onPasswordInput(e)}
            />
          </div>
          <div class="form-element">
            <label for="confirm-new-password">
              Confirm new password
            </label>
            <input
              class="text-input"
              type="password"
              name="confirm-new-password"
              required
              onInput={(e) => onPasswordConfirmInput(e)}
            />
          </div>
          <PasswordScore
            score={passwordScore()}
            warning={passwordWarning()}
          />
          <Show when={passwordsDoNotMatch()}>
            <p class="type-body-2" role="alert">
              Passwords must match
            </p>
          </Show>
          <Show when={settingNewPassword.result}>
            <p role="alert" id="error-message" class="error-message">
              <img src="/svgs/error_fire100.svg" alt="error icon" />
              {settingNewPassword.result!.message}
            </p>
          </Show>
          <button
            class="btn btn-primary"
            type="submit"
            disabled={passwordScore()! < 4 || passwordsDoNotMatch()}
          >
            Submit
          </button>
        </form>
        <div class="bubble-lg" />
        <div class="bubble-sm" />
      </main>
      </>
  );
}
