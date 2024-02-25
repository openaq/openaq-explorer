import { useSearchParams, useSubmission, A } from '@solidjs/router';
import { Header } from '~/components/Header';
import style from './Expired.module.scss';
import { resendVerificationEmailAction } from '~/db';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const resendingVerificationEmail = useSubmission(
    resendVerificationEmailAction
  );

  return (
    <>
      <Header />
      <main class={style['main']}>
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
                class={style['error-message']}
              >
                <img src="/svgs/error_fire100.svg" alt="error icon" />
                {resendingVerificationEmail.result!.message}
              </p>
            </Show>
            <button class="btn btn-primary" type="submit">Request new code</button>
          </form>
        </div>
        <div class={style['bubble-lg']} />
        <div class={style['bubble-sm']} />
      </main>
    </>
  );
}
