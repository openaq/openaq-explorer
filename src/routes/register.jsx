import { Show, createSignal } from 'solid-js';
import {
  useParams,
  useRouteData,
  useServerContext,
} from 'solid-start';
import { FormError } from 'solid-start/data';
import { A } from 'solid-start';

import { isServer } from 'solid-js/web';
import {
  createServerAction$,
  createServerData$,
  redirect,
} from 'solid-start/server';
// import { db } from "~/db";
import {
  createUserSession,
  getUser,
  login,
  register,
} from '~/db/session';

import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import PasswordScore from '~/components/PasswordScore';

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

export function routeData() {
  return createServerData$(async (_, { request, clientAddress }) => {
    if (await getUser(request)) {
      throw redirect('/');
    }
    return { clientAddress: clientAddress };
  });
}

export default function Register() {
  const data = useRouteData();
  const params = useParams();

  const [passwordInputValue, setPasswordInputValue] = createSignal();
  const [passwordConfirmInputValue, setPasswordConfirmInputValue] =
    createSignal();

  const [passwordScore, setPasswordScore] = createSignal();
  const [passwordWarning, setPasswordWarning] = createSignal();
  const [passwordsMatch, setPasswordsMatch] = createSignal();

  function validateFullName(fullName) {
    if (typeof fullName !== 'string' || fullName !== '') {
      return `Name is required`;
    }
  }

  function validateEmail(emailAddress) {
    if (typeof emailAddress !== 'string' || emailAddress !== '') {
      return `Email address is required`;
    }
  }

  const validatePassword = (password, passwordConfirm) => {
    let errors = [];
    if (password.length < 8) {
      errors.push('Passwords must be at least 8 characters long');
    }
    if (passwordScore() < 4) {
      errors.push(
        'Passwords not strong enough, please choose a strong password'
      );
    }
    if (password !== passwordConfirm) {
      errors.push('Passwords must match');
    }
    return errors;
  };

  let passwordInputTimeout;

  const onPasswordInput = (e) => {
    setPasswordInputValue(e.target.value);
    clearTimeout(passwordInputTimeout);
    passwordInputTimeout = setTimeout(() => {
      const result = zxcvbn(e.target.value);
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
        setPasswordsMatch('passwords must match');
      } else {
        setPasswordsMatch('');
      }
    }, 500);
  };

  const [registering, { Form }] = createServerAction$(
    async (form, { clientAddress }) => {
      const fullName = form.get('fullname');
      const emailAddress = form.get('email-address');
      const password = form.get('password');
      const passwordConfirm = form.get('password-confirm');
      const forwardParams = form.get('forwardParams') || '';

      if (
        typeof emailAddress !== 'string' ||
        typeof fullName !== 'string' ||
        typeof password !== 'string' ||
        typeof forwardParams !== 'string'
      ) {
        throw new FormError(`Form not submitted correctly.`);
      }

      const fields = {
        fullName,
        emailAddress,
        password,
        passwordConfirm,
      };

      const fieldErrors = {
        fullName: validateFullName(fullName),
        emailAddress: validateEmail(emailAddress),
        password: validatePassword(password, passwordConfirm),
      };

      if (Object.values(fieldErrors).some(Boolean)) {
        throw new FormError('Fields invalid', {
          fieldErrors,
          fields,
        });
      }

      const user = await register({
        fullName,
        emailAddress,
        password,
        clientAddress,
      });
      if (!user) {
        throw new FormError(
          `Email/Password combination is incorrect`,
          {
            fields,
          }
        );
      }

      return createUserSession(
        `${user.id}`,
        '/verify-email',
        forwardParams
      );
    }
  );

  return (
    <main class="register-page">
      <h1 class="type-display-1 text-sky-120">Create an account</h1>
      <Form class="register-form">
        <input
          type="hidden"
          name="forwardParams"
          value={params.forwardParams ?? ''}
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
            placeholder=" "
            autocomplete="on"
            required
          />
        </div>
        <Show when={registering.error?.fieldErrors?.username}>
          <p role="alert">{registering.error.fieldErrors.username}</p>
        </Show>
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
        <Show when={passwordsMatch()}>
          <p role="alert">{passwordsMatch()}</p>
        </Show>
        <PasswordScore
          score={passwordScore()}
          warning={passwordWarning()}
        />
        <Show when={registering.error?.fieldErrors?.password}>
          <p role="alert">{registering.error.fieldErrors.password}</p>
        </Show>
        <Show when={registering.error}>
          <p role="alert" id="error-message">
            {registering.error.message}
          </p>
        </Show>
        <button class="btn btn-primary" type="submit">
          {data() ? 'Get started' : ''}
        </button>
      </Form>

      <div>
        <span class="type-subtitle-3 text-sky-120">
          Already have an account?{' '}
          <A class="type-link-3 text-sky-120" href="/login">
            Login
          </A>
        </span>
      </div>
    </main>
  );
}
