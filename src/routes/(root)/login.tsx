import { Show } from 'solid-js';
import {
  A,
  useSubmission,
  useSearchParams,
  createAsync,
} from '@solidjs/router';
import { redirectIfLoggedIn } from '~/auth/user';
import { login } from '~/auth/user';
import '~/assets/scss/routes/login.scss';
import ErrorIcon from '~/assets/imgs/error.svg';

export const route = {
  preload: () => redirectIfLoggedIn(),
};

export default function Login() {
  createAsync(() => redirectIfLoggedIn());

  const [searchParams] = useSearchParams();

  let redirect;
  if (
    ['/login', '/verify-email', '/register'].includes(
      (searchParams.redirect as string) ?? '/'
    )
  ) {
    redirect = '/';
  } else {
    redirect = searchParams.redirect;
  }

  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '##dd443c',
  };

  const loggingIn = useSubmission(login);

  return (
    <>
      <main class="login-page">
        <h1 class="type-display-1 text-sky-120">Login</h1>
        <form
          action={login}
          class="login-form"
          method="post"
          enctype="multipart/form-data"
        >
          <input type="hidden" name="redirect" value={redirect} />
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
            <label class="type-subtitle-3 text-sky-120" for="password-input">
              Password
            </label>
            <input name="password" type="password" class="text-input" />
          </div>
          <div class="form-element-row">
            <input
              type="checkbox"
              name="remember-me"
              id="remember-me"
              class="checkbox"
            />
            <label class="type-subtitle-3 text-sky-120" for="password-input">
              Remember me for 30 days
            </label>
          </div>
          <Show when={loggingIn.result}>
            <p role="alert" id="error-message" class="error-message">
              <ErrorIcon {...svgAttributes} />
              {loggingIn.result!.message}
            </p>
          </Show>
          <div class="form-element">
            <button
              class="btn btn-primary"
              type="submit"
              disabled={loggingIn.pending}
            >
              {loggingIn.pending ? 'Logging in' : 'Login'}
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
          <p class="info-message">
            If you had previously registered for an OpenAQ API key you already
            have an OpenAQ Explorer account! use the email and password you
            previously signed up with to get started.
          </p>
        </div>
      </main>
    </>
  );
}
