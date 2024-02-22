import { Show, createSignal } from 'solid-js';

import {
  A,
  createAsync,
  useSearchParams,
  useSubmission,
} from '@solidjs/router';

import { registerAction } from '~/db';

import { getUser } from '~/db';

import PasswordScore from '~/components/PasswordScore';
import { evaluatePassword } from '~/lib/password';
import { Header } from '~/components/Header';

export const route = {
  load: () => getUser(),
};

export default function Register() {
  const [searchParams] = useSearchParams();


  const user = createAsync(() => getUser(), { deferStream: true });

  const [passwordInputValue, setPasswordInputValue] = createSignal();
  const [passwordConfirmInputValue, setPasswordConfirmInputValue] =
    createSignal();

  const [passwordScore, setPasswordScore] = createSignal();
  const [passwordWarning, setPasswordWarning] = createSignal();
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] =
    createSignal('');

  let passwordInputTimeout;

  const onPasswordInput = (e) => {
    setPasswordInputValue(e.target.value);
    clearTimeout(passwordInputTimeout);
    passwordInputTimeout = setTimeout(() => {
      const result = evaluatePassword(e.target.value);
      if (e.target.value !== '') {
        setPasswordScore(result.score);
        setPasswordWarning(result.feedback.warning);
      } else {
        setPasswordScore(-1);
        setPasswordWarning('');
      }
    }, 500);
  };

  let passwordConfirmInputTimeout;

  const onPasswordConfirmInput = (e) => {
    setPasswordConfirmInputValue(e.target.value);
    clearTimeout(passwordConfirmInputTimeout);
    passwordConfirmInputTimeout = setTimeout(() => {
      if (passwordInputValue() !== passwordConfirmInputValue()) {
        setPasswordsDoNotMatch('passwords must match');
      } else {
        setPasswordsDoNotMatch('');
      }
    }, 500);
  };

  const registering = useSubmission(registerAction);

  return (
    <>
      <Header loggedIn={user() ? true : false} />
      <main class="register-page">
        <h1 class="type-display-1 text-sky-120">Create an account</h1>
        <form
          action={registerAction}
          class="register-form"
          method="post"
        >
          <input
            type="hidden"
            name="redirect"
            value={searchParams.redirect ?? '/'}
          />
          <div class="form-element">
            <label
              for="fullname"
              class="type-subtitle-3 text-sky-120"
            >
              Full Name
            </label>
            <input
              class="text-input"
              name="fullname"
              autocomplete="on"
              placeholder=" "
              required
            />
          </div>
          <div class="form-element">
            <label
              for="email-address"
              class="type-subtitle-3 text-sky-120"
            >
              Email address
            </label>
            <input
              class="text-input"
              name="email-address"
              type="email"
              placeholder=" "
              autocomplete="on"
              required
            />
          </div>
          <div class="form-element">
            <label
              for="password-input"
              class="type-subtitle-3 text-sky-120"
            >
              Password (mininum 8 characters)
            </label>
            <input
              name="password"
              id="password"
              type="password"
              minlength="8"
              placeholder=" "
              class="text-input"
              required
              onInput={(e) => onPasswordInput(e)}
            />
          </div>
          <div class="form-element">
            <label
              for="password-confirm"
              class="type-subtitle-3 text-sky-120"
            >
              Confirm Password
            </label>
            <input
              name="password-confirm"
              id="password-confirm"
              type="password"
              minlength="8"
              placeholder=" "
              class="text-input"
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
              {passwordsDoNotMatch()}
            </p>
          </Show>

          <button
            class="btn btn-primary"
            type="submit"
            disabled={passwordScore() < 4 || passwordsDoNotMatch()}
          >
            Get started
          </button>
        </form>

        <Show when={registering.result}>
          <p style={{color: "red"}} role="alert" id="error-message">
            {registering.result!.message}
          </p>
        </Show>
        <div>
          <span class="type-subtitle-3 text-sky-120">
            Already have an account?{' '}
            <A class="type-link-3 text-sky-120" href="/login">
              Login
            </A>
          </span>
        </div>
        <div>
          <p style="width: 500px;" class="type-body-3 text-sky-120">
            If you had previously registered for an OpenAQ API key you already have an OpenAQ Explorer account! use the email and password you previously signed up with to get started.
          </p>
        </div>
      </main>
    </>
  );
}
