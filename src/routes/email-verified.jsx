import { A } from '@solidjs/router';
import { Header } from '~/components/Header';
import style from './EmailVerified.module.scss';

export default function EmailVerified() {
  return (
    <>
      <Header />
      <main class={style['main']}>
        <h1 class="type-heading-1 text-sky-120">
          Email address verified
        </h1>
        <p class="type-body-1">
          Your email address was successfully verified.
        </p>
        <p class="type-body-1">
          You can now{' '}
          <A href="/login" class="type-link-1">
            login
          </A>{' '}
          to your account
        </p>
        <div class={style['bubble-lg']} />
        <div class={style['bubble-sm']} />
      </main>
    </>
  );
}
