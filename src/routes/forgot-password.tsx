import {  useSubmission } from '@solidjs/router';
import { forgotPasswordLinkAction } from '~/db';
import { Header } from '~/components/Header';
import style from './ForgotPassword.module.scss';
import { Show } from 'solid-js';

export default function VerifyEmail() {
  const requestingPasswordReset = useSubmission(forgotPasswordLinkAction);

  return (
    <>
      <Header />
      <main class={style['main']}>
        <h1 class="type-heading-1 text-sky-120">Forgot your password?</h1>
        <span class="type-body-3">Enter your email address below and we will send you link to reset your password.</span>
        <form action={forgotPasswordLinkAction} method='post'>
        <div class={style["form-element"]}>

            <label for="email-address">Email address</label>
            <input class="text-input" type="email" required name='email-address'/>
            </div>
            <Show when={requestingPasswordReset.result}>
            <p
              role="alert"
              id="error-message"
              class={style['error-message']}
            >
              <img src="/svgs/error_fire100.svg" alt="error icon" />
              {requestingPasswordReset.result!.message}
            </p>
          </Show>
            <button class="btn btn-primary" type="submit">Submit</button>
        </form>

        <div class={style['bubble-lg']} />
        <div class={style['bubble-sm']} />
      </main>
    </>
  );
}
