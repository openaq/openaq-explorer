import { A } from '@solidjs/router';
import '~/assets/scss/routes/email-verified.scss';

export default function EmailVerified() {
  return (
    <>
      <main class="main">
        <h1 class="type-heading-1 text-sky-120">Email address verified</h1>
        <p class="type-body-1">Your email address was successfully verified.</p>
        <p class="type-body-1">
          You can now{' '}
          <A href="/login" class="type-link-1">
            login
          </A>{' '}
          to your account
        </p>
        <div class="bubble-lg" />
        <div class="bubble-sm" />
      </main>
    </>
  );
}
