import { useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import { passwordChangeAction } from '~/db';

import '~/assets/scss/components/password-form.scss';


export function PasswordForm() {
    const changingPassword = useSubmission(passwordChangeAction);
  
    return (
      <form class="password-form" action={passwordChangeAction} method="post">
        <div class="form-element">
          <label for="current-password">Current password</label>
          <input
            type="password"
            name="current-password"
            id="current-password"
            class="text-input"
          />
        </div>
        <div class="form-element">
          <label for="new-password">New password</label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            class="text-input"
          />
        </div>
        <div class="form-element">
          <label for="confirm-new-password">Confirm new password</label>
          <input
            type="password"
            name="confirm-new-password"
            id="confirm-new-password"
            class="text-input"
          />
        </div>
        <div class="form-element">
        <Show when={changingPassword.result}>
          <p style={{color: "red"}} role="alert" id="error-message">
            {changingPassword.result!.message}
          </p>
        </Show>
        <div>
          <button type="submit" class="btn btn-primary">
            Change password
          </button>
          </div>
        </div>
      </form>
    );
  }