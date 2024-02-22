import { useSearchParams, useSubmission } from '@solidjs/router';
import { resendEmailAction } from '~/db';
import { Header } from '~/components/Header';
import style from './VerifyEmail.module.scss';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const resendingEmail = useSubmission(resendEmailAction);

  return (
    <>
      <Header />
      <main class={style['main']}>
        <h1 class="type-heading-1 text-sky-120">Verify your email</h1>
        <p class="type-body-1">
          We just sent an email to{' '}
          <span class="type-body-2">{searchParams.email}</span>
        </p>
        <p class="type-body-1">
          Please click on the link in the email to verify your
          account.
        </p>
        <div></div>
        <div class={style['bubble-lg']} />
        <div class={style['bubble-sm']} />
      </main>
    </>
  );
}
