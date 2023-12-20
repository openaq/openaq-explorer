import { A } from 'solid-start';

export default function EmailVerified() {
  return (
    <main>
      <h1>Email Address Verified</h1>
      <p>Your email address was successfully verified.</p>
      <div>
        <A href="/account">View profile</A>
      </div>
    </main>
  );
}
