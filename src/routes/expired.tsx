import { useSearchParams, useSubmission, A } from '@solidjs/router';
import { resendVerificationEmailAction } from '~/db';

import '~/assets/scss/routes/expired.scss';
import { Header } from '~/components/Header';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const resendingVerificationEmail = useSubmission(
    resendVerificationEmailAction
  );

  return (
    <>
      <Header />
      <main class='main'>
        <h1 class="type-heading-1 text-sky-120">
          Verification token expired
        </h1>
        <p class="type-body-1">
          The verification token sent to your email has expired. You
          can request a new one by clicking the button below.
        </p>
        <p class="type-body-1">
          Please verify email address within 30 minutes of recieving
          the verification email.
        </p>
        <div>
          <form action={resendVerificationEmailAction} method="post">
            <input
              type="hidden"
              name="verification-code"
              value={searchParams.code}
            />
            <Show when={resendingVerificationEmail.result}>
              <p
                role="alert"
                id="error-message"
                class='error-message'
              >
                <img src="/svgs/error_fire100.svg" alt="error icon" />
                {resendingVerificationEmail.result!.message}
              </p>
            </Show>
            <button class="btn btn-primary" type="submit">Request new code</button>
          </form>
        </div>
        <div class='bubble-lg' />
        <div class='bubble-sm' />
      </main>
      </>
  );
}
