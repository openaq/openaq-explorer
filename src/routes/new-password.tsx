import { useSearchParams, useSubmission } from '@solidjs/router';
import { forgotPasswordAction } from '~/db';
import { Header } from '~/components/Header';
import style from './NewPassword.module.scss';
import { For, Show } from 'solid-js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const settingNewPassword = useSubmission(forgotPasswordAction);

  return (
    <>
      <Header />
      <main class={style['main']}>
        <h1 class="type-heading-1 text-sky-120">
          Forgot your password?
        </h1>
        <form
          action={forgotPasswordAction}
          method="post"
          class={style['new-password-form']}
        >
          <input type="hidden" name="verification-code" value={searchParams.code} />
          <div class={style['form-element']}>
            <label for="new-password">New password</label>
            <input
              class="text-input"
              type="password"
              name="new-password"
            />
          </div>
          <div class={style['form-element']}>
            <label for="confirm-new-password">
              Confirm new password
            </label>
            <input
              class="text-input"
              type="password"
              name="confirm-new-password"
            />
          </div>
          <Show when={settingNewPassword.result}>
            <p
              role="alert"
              id="error-message"
              class={style['error-message']}
            >
              <img src="/svgs/error_fire100.svg" alt="error icon" />
              {settingNewPassword.result!.message}
            </p>
          </Show>
          <button class="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        <div class={style['bubble-lg']} />
        <div class={style['bubble-sm']} />
      </main>
    </>
  );
}
