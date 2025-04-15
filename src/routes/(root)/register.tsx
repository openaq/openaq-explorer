import { Show, createSignal } from 'solid-js';

import {
  A,
  createAsync,
  useSearchParams,
  useSubmission,
} from '@solidjs/router';

import PasswordScore from '~/components/PasswordScore';
import { evaluatePassword } from '~/lib/password';

import '~/assets/scss/routes/register.scss';
import { Score } from '@zxcvbn-ts/core/dist/types';
import { redirectIfLoggedIn, register } from '~/auth/user';

export const route = {
  load() {
    void redirectIfLoggedIn();
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
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = createSignal<boolean>();

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
        setPasswordsDoNotMatch(true);
      } else {
        setPasswordsDoNotMatch(false);
      }
    }, 500);
  };

  const registering = useSubmission(register);

  const registrationDisabled =
    import.meta.env.VITE_REGISTRATION_DISABLED === 'true';

  return (
    <>
      <main class="register-page">
        <h1 class="type-display-1 text-sky-120">Create an account</h1>
        <Show
          when={!registrationDisabled}
          fallback={
            <span>
              The OpenAQ Explorer is experiencing issues with new account
              registration.
              <br /> We are currently working on a fix, please try again later.
            </span>
          }
        >
          <form action={register} class="register-form" method="post">
            <input
              type="hidden"
              name="redirect"
              value={searchParams.redirect ?? '/'}
            />
            <div class="form-element">
              <label for="fullname" class="type-subtitle-3 text-sky-120">
                Full Name
              </label>
              <input
                class="text-input"
                name="fullname"
                autocomplete="on"
                placeholder=" "
                disabled={registering.pending}
                required
              />
            </div>
            <div class="form-element">
              <label for="email-address" class="type-subtitle-3 text-sky-120">
                Email address
              </label>
              <input
                class="text-input"
                name="email-address"
                type="email"
                placeholder=" "
                autocomplete="on"
                disabled={registering.pending}
                required
              />
            </div>
            <div class="form-element">
              <label for="password-input" class="type-subtitle-3 text-sky-120">
                Password (mininum 8 characters)
              </label>
              <input
                name="password"
                id="password"
                type="password"
                minlength="8"
                placeholder=" "
                class="text-input"
                disabled={registering.pending}
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
                disabled={registering.pending}
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
              disabled={
                registering.pending ||
                passwordScore()! < 4 ||
                passwordsDoNotMatch()
              }
            >
              {registering.pending ? 'Registering...' : 'Get started'}
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
              By registering and using OpenAQ services, you agree to the OpenAQ{' '}
              <A
                class="type-link-3 text-sky-120"
                href="https://docs.openaq.org/about/terms"
              >
                Terms of Use
              </A>
              ,{' '}
              <A
                class="type-link-3 text-sky-120"
                href="https://openaq.org/privacy/"
              >
                Privacy Policy
              </A>{' '}
              and{' '}
              <A
                class="type-link-3 text-sky-120"
                href="https://openaq.org/cookies/"
              >
                Cookie Policy
              </A>
              .
            </p>
            <br />
            <p style="width: 500px;" class="type-body-3 text-sky-120">
              If you had registered for an OpenAQ API key prior to January 2024
              you already have an OpenAQ Explorer account! use the email and
              password you previously signed up with to get started.
            </p>
          </div>
        </Show>
      </main>
    </>
  );
}
