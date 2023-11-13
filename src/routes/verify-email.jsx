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
        <a href="/update-email">Update email address</a>
      </div>
    </main>
  );
}
