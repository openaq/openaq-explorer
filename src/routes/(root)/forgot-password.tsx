import {  useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import '~/assets/scss/routes/forgot-password.scss';
import { forgotPasswordLink } from '~/auth/user';

export default function VerifyEmail() {
  const requestingPasswordReset = useSubmission(forgotPasswordLink);

  return (
    <>
      <main class='main'>
        <h1 class="type-heading-1 text-sky-120">Forgot your password?</h1>
        <span class="type-body-3">Enter your email address below and we will send you link to reset your password.</span>
        <form action={forgotPasswordLink} method='post'>
        <div class="form-element">

            <label for="email-address">Email address</label>
            <input class="text-input" type="email" required name='email-address' disabled={requestingPasswordReset.pending}/>
            </div>
            <Show when={requestingPasswordReset.result}>
            <p
              role="alert"
              id="error-message"
              class='error-message'
            >
              <img src="/svgs/error_fire100.svg" alt="error icon" />
              {requestingPasswordReset.result!.message}
            </p>
          </Show>
            <button class="btn btn-primary" type="submit" disabled={requestingPasswordReset.pending}>
            {requestingPasswordReset.pending ? 
              'Requesting...' :'Submit'}
            </button>
        </form>

        <div class='bubble-lg' />
        <div class='bubble-sm' />
      </main>
</>
  );
}
