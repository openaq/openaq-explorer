import { A } from 'solid-start';

export default function VerifyEmail() {
  const [, { ResendEmailForm }] = createServerAction$(
    (f, { request }) => resendEmail(request)
  );

  return (
    <main>
      <h1>Verify your email</h1>
      <p>
        We just sent an email to {}
        Please click on the link in the email to verify your account.
      </p>
      <div>
        <ResendEmailForm>
          <button name="logout" type="submit">
            Resend email
          </button>
        </ResendEmailForm>
        <A href="/update-email">Update email address</A>
      </div>
    </main>
  );
}
