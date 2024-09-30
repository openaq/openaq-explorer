import { getUser } from '~/db';
import { Toast } from '~/components/Toast';
import { createAsync } from '@solidjs/router';
import { PasswordForm } from '~/components/Account/PasswordForm';
import { ApiKeyRegenerateConfirmModal } from '~/components/Modals/ApiKeyRegenerateConfirmModal';
import { useStore } from '~/stores';
import { Header } from '~/components/Header';

import '~/assets/scss/routes/account.scss';
import { Suspense } from 'solid-js';

export const route = {
  load: () => {
    getUser();
  },
};

function copyApiKey(token: string) {
  navigator.clipboard.writeText(token);
}

export default function Acount() {
  const user = createAsync(() => getUser());
  const [store, { openToast, toggleRegenerateKeyModalOpen }] =
    useStore();

  return (
    <>
      <Header />
      <Suspense >
      <main class="account-page">
        <ApiKeyRegenerateConfirmModal />
        <h1 class="type-display-1 text-sky-120">OpenAQ Account</h1>
        <section class="account-page__section">
          <h2 class="type-heading-2  text-sky-120">Basics</h2>
          <div class="form-element">
            <label for="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              class="text-input"
              value={user()?.fullname}
            />
          </div>

          <div class="form-element">
            <label for="name">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              class="text-input"
              value={user()?.emailAddress}
            />
          </div>
        </section>
        <section class="account-page__section">
          {' '}
          <h2 class="type-heading-2 text-sky-120">Change password</h2>
          <PasswordForm />
        </section>
        <section class="account-page__section">
          <h2 class="type-heading-2 text-sky-120">API Key</h2>
          <input class="text-input" value={user()?.token} />
          <div class="api-key-buttons">
            <button
              class="btn btn-primary"
              onClick={() => {
                copyApiKey(user()?.token!);
                openToast();
              }}
            >
              Copy
            </button>
            <button
              class="btn btn-primary"
              onClick={() => toggleRegenerateKeyModalOpen()}
            >
              Regenerate
            </button>
          </div>
        </section>
        <Toast message={'API Key copied to clipboard'} />
      </main>
      </Suspense>
    </>
  );
}
