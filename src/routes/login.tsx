import { Show } from 'solid-js';
import {
  A,
  useSubmission,
  useSearchParams,
} from '@solidjs/router';
import { loginAction } from '~/db';
import { Header } from '~/components/Header';
import { getUser } from '~/db';
import style from './Login.module.scss'

export const route = {
  load: () => getUser(),
};

export default function Login() {
  const [searchParams] = useSearchParams()

  const loggingIn = useSubmission(loginAction);



  return (
    <>
      <Header />
      <main class="login-page">
        <h1 class="type-display-1 text-sky-120">Login</h1>
        <form action={loginAction} class="login-form" method="post" enctype='multipart/form-data'>
          <input
            type="hidden"
            name="redirect"
            value={searchParams.redirect ?? '/'}
          />
          <div class="form-element">
            <label
              class="type-subtitle-3 text-sky-120"
              for="email-address-input"
            >
              Email Address
            </label>
            <input name="email-address" class="text-input" type="email" />
          </div>
          <div class="form-element">
            <label
              class="type-subtitle-3 text-sky-120"
              for="password-input"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              class="text-input"
            />
          </div>
          <div class="form-element-row">
          <input
              type="checkbox"
              name="remember-me"
              id="remember-me"
              class="checkbox"
            />
            <label
              class="type-subtitle-3 text-sky-120"
              for="password-input"
            >
              Remember me for 30 days
            </label>

          </div>
          <Show when={loggingIn.result}>
            <p role="alert" id="error-message" class={style['error-message']}>
              <img src="/svgs/error_fire100.svg" alt="error icon" />{loggingIn.result!.message}
            </p>
          </Show>
          <div class="form-element">
            <button class="btn btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>

        <div>
          <span class="type-subtitle-3 text-sky-120">
            Don't have an account?{' '}
            <A class="type-link-3 text-sky-120" href="/register">
              Sign up
            </A>
          </span>
        </div>
        <div>
          <span class="type-subtitle-3 text-sky-120">
            Forgot your password?{' '}
            <A class="type-link-3 text-sky-120" href="/forgot-password">
              Reset password
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
