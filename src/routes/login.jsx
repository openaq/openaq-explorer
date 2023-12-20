import { Show } from 'solid-js';
import { useParams, useRouteData, A } from 'solid-start';
import { FormError } from 'solid-start/data';
import {
  createServerAction$,
  createServerData$,
  redirect,
} from 'solid-start/server';
import { login, createUserSession, getUser } from '~/db/session';

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const foo = await getUser(request);
    if (foo) {
      throw redirect('/');
    }
    return {};
  });
}

export default function Login() {
  const data = useRouteData();
  const params = useParams();

  const [loggingIn, { Form }] = createServerAction$(async (form) => {
    const email = form.get('email-address');
    const password = form.get('password');
    const rememberMe = form.get('remember-me');
    const redirectTo = form.get('redirectTo') || '/';

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof redirectTo !== 'string'
    ) {
      throw new FormError(`Form not submitted correctly.`);
    }
    const remember = rememberMe == 'on' ? true : false;
    const user = await login({ email, password });
    if (!user) {
      throw new FormError(`Email/Password combination is incorrect`);
    }
    console.log(remember);
    return createUserSession(`${user.usersId}`, redirectTo, remember);
  });

  return (
    <main class="login-page">
      <h1 class="type-display-1 text-sky-120">Login</h1>
      <Form class="login-form">
        <input
          type="hidden"
          name="redirectTo"
          value={params.redirectTo ?? '/'}
        />
        <div class="form-element">
          <label
            class="type-subtitle-3 text-sky-120"
            for="email-address-input"
          >
            Email Address
          </label>
          <input name="email-address" class="text-input" />
        </div>
        <div class="form-element">
          <label
            class="type-subtitle-3 text-sky-120"
            for="password-input"
          >
            Password
          </label>
          <input name="password" type="password" class="text-input" />
        </div>
        <div class="form-element-row">
          <label
            class="type-subtitle-3 text-sky-120"
            for="password-input"
          >
            Remember me for 30 days
          </label>
          <input
            type="checkbox"
            name="remember-me"
            id="remember-me"
            class="checkbox"
          />
        </div>
        <Show when={loggingIn.error}>
          <p role="alert" id="error-message">
            {loggingIn.error.message}
          </p>
        </Show>
        <div class="form-element">
          <button class="btn btn-primary" type="submit">
            {data() ? 'Login' : ''}
          </button>
        </div>
      </Form>
      <div>
        <span class="type-subtitle-3 text-sky-120">
          Don't have an account?{' '}
          <A class="type-link-3 text-sky-120" href="/register">
            Sign up
          </A>
        </span>
      </div>
    </main>
  );
}
