import '~/assets/scss/routes/password-email.scss';
import { Header } from '~/components/Header';

export default function PasswordEmail() {
  return (
    <>
      <Header />
    <main class="main">
      <h1 class="type-heading-1 text-sky-120">Check your email</h1>
      <p class="type-body-1">
        We just sent an email to the provided email address with a
        password reset link.
      </p>
      <p class="type-body-1">
        Please check you email and click the provided link to change
        your password
      </p>
      <div />
      <div class="bubble-lg" />
      <div class="bubble-sm" />
    </main>
    </>
  );
}
