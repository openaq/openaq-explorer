import { Show } from 'solid-js';
import { useParams, useRouteData } from 'solid-start';
import { FormError } from 'solid-start/data';
import {
  createServerAction$,
  createServerData$,
  redirect,
} from 'solid-start/server';
import { login, createUserSession, getUser } from '~/db/session';
import { A } from 'solid-start';

export default function PasswordReset() {
  const [loggingIn, { Form }] = createServerAction$(async (form) => {
    const email = form.get('email-address');

    if (typeof email !== 'string') {
      throw new FormError(`Form not submitted correctly.`);
    }

    const user = await passwordReset({ email, password });
    if (!user) {
      throw new FormError(`Email/Password combination is incorrect`);
    }
    return createUserSession(`${user.usersId}`, redirectTo);
  });

  return (
    <main>
      <h1>Forgot passowrd</h1>
      <Form>
        <div>
          <label for="email-address-input">Email Address</label>
          <input name="email-address" />
        </div>
        <Show when={loggingIn.error}>
          <p role="alert" id="error-message">
            {loggingIn.error.message}
          </p>
        </Show>
        <button type="submit">Send password reset link</button>
      </Form>
      <div>
        Don't have an account? <A href="/register">Sign up</A>
      </div>
    </main>
  );
}
