import { useSearchParams, useSubmission } from '@solidjs/router';
import { resendEmailAction } from '~/db';
import { Header } from '~/components/Header';
import style from './Expired.module.scss';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const resendingEmail = useSubmission(resendEmailAction);

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
          <form action={resendEmailAction}>
            <button
              class="btn btn-primary"
              name="resend"
              type="submit"
            >
              Resend email
            </button>
          </form>
        </div>
        <div class={style['bubble-lg']} />
        <div class={style['bubble-sm']} />
      </main>
    </>
  );
}
