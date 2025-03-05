import { useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import '~/assets/scss/routes/forgot-password.scss';
import { forgotPasswordLink } from '~/auth/user';
import ErrorIcon from '~/assets/imgs/error.svg';

export default function VerifyEmail() {
  const requestingPasswordReset = useSubmission(forgotPasswordLink);

  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '##dd443c',
  };

  return (
    <>
      <main class="main">
        <h1 class="type-heading-1 text-sky-120">Forgot your password?</h1>
        <span class="type-body-3">
          Enter your email address below and we will send you link to reset your
          password.
        </span>
        <form action={forgotPasswordLink} method="post">
          <div class="form-element">
            <label for="email-address">Email address</label>
            <input
              class="text-input"
              type="email"
              required
              name="email-address"
              disabled={requestingPasswordReset.pending}
            />
          </div>
          <Show when={requestingPasswordReset.result}>
            <p role="alert" id="error-message" class="error-message">
              <ErrorIcon {...svgAttributes} />
              {requestingPasswordReset.result!.message}
            </p>
          </Show>
          <button
            class="btn btn-primary"
            type="submit"
            disabled={requestingPasswordReset.pending}
          >
            {requestingPasswordReset.pending ? 'Requesting...' : 'Submit'}
          </button>
        </form>

        <div class="bubble-lg" />
        <div class="bubble-sm" />
      </main>
    </>
  );
}
