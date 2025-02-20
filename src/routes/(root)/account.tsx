import { Toast } from '~/components/Toast';
import { createAsync, type RouteDefinition } from '@solidjs/router';
import { PasswordForm } from '~/components/Account/PasswordForm';
import { ApiKeyRegenerateConfirmModal } from '~/components/Modals/ApiKeyRegenerateConfirmModal';
import { useStore } from '~/stores';

import '~/assets/scss/routes/account.scss';
import { getLoggedInUser } from '~/auth/user';

export const route: RouteDefinition = {
  preload: () => getLoggedInUser(),
};

function copyApiKey(token: string) {
  navigator.clipboard.writeText(token);
}

export default function Account() {
  const user = createAsync(() => getLoggedInUser(), { deferStream: true });
  const [_, { openToast, toggleRegenerateKeyModalOpen }] = useStore();

  return (
    <>
      <main class="account-page">
        <ApiKeyRegenerateConfirmModal token={user()?.token} />
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
              value={user()?.email}
            />
          </div>
        </section>
        <section class="account-page__section">
          <h2 class="type-heading-2 text-sky-120">Change password</h2>
          <PasswordForm />
        </section>
        <section class="account-page__section">
          <h2 class="type-heading-2 text-sky-120">API Key</h2>
          <input class="text-input" value={user()?.token}></input>
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
    </>
  );
}
