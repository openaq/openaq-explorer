import { Show, createSignal } from 'solid-js';

import {
  A,
  createAsync,
  useSearchParams,
  useSubmission,
} from '@solidjs/router';

import { registerAction, redirectIfLoggedIn, getUserId } from '~/db';

import PasswordScore from '~/components/PasswordScore';
import { evaluatePassword } from '~/lib/password';

import '~/assets/scss/routes/register.scss';
import { Header } from '~/components/Header';
import { Score } from '@zxcvbn-ts/core/dist/types';


export const route = {
  load() {
    void redirectIfLoggedIn();
    void getUserId();
  },
};


export default function Register() {
  createAsync(() => redirectIfLoggedIn());


  const [searchParams] = useSearchParams();

  const [passwordInputValue, setPasswordInputValue] = createSignal<string>();
  const [passwordConfirmInputValue, setPasswordConfirmInputValue] =
    createSignal<string>();

  const [passwordScore, setPasswordScore] = createSignal<Score>();
  const [passwordWarning, setPasswordWarning] = createSignal<string>();
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] =
    createSignal<boolean>();

  let passwordInputTimeout: number;

  const onPasswordInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setPasswordInputValue(target.value);
    clearTimeout(passwordInputTimeout);
    passwordInputTimeout = window.setTimeout(() => {
      const result = evaluatePassword(target!.value);
      if (target!.value !== '') {
        setPasswordScore(result.score);
        setPasswordWarning(result.feedback.warning);
      } else {
        setPasswordScore(undefined);
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
        setPasswordsDoNotMatch(false);
      } else {
        setPasswordsDoNotMatch(true);
      }
    }, 500);
  };

  const registering = useSubmission(registerAction);

  return (
    <>
      <Header />
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
              Passwords must match
            </p>
          </Show>

          <button
            class="btn btn-primary"
            type="submit"
            disabled={passwordScore()! < 4 || passwordsDoNotMatch()}
          >
            Get started
          </button>
        </form>

        <Show when={registering.result}>
          <p style={{ color: 'red' }} role="alert" id="error-message">
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
            If you had previously registered for an OpenAQ API key you
            already have an OpenAQ Explorer account! use the email and
            password you previously signed up with to get started.
          </p>
        </div>
      </main>
    </>
  );
}
