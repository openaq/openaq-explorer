import { A } from 'solid-start';

export default function PasswordReset() {
  return (
    <main>
      <h1>Password reset link sent</h1>
      <p>
        We just sent an email to {}
        Please click on the link in the email to reset your password.
      </p>
      <div>
        <A href="/password-reset">Re-enter email address</A>
      </div>
    </main>
  );
}
