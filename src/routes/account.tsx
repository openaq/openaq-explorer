import { getUser } from '~/db';
import {Toast } from '~/components/Toast';
import { createAsync } from '@solidjs/router';
import { Header } from '~/components/Header';
import { PasswordForm } from '~/components/Account/PasswordForm';
import { ApiKeyRegenerateConfirmModal } from '~/components/Modals/ApiKeyRegenerateConfirmModal';
import style from './Account.module.scss';
import { useStore } from '~/stores';

export const route = {
  load: () => getUser(),
};

function copyApiKey(token: string) {
  navigator.clipboard.writeText(token);
}

export default function Acount() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const [store, {openToast, toggleRegenerateKeyModalOpen}] = useStore();


  return (
    <>
      <Header />
      <main class={style['account-page']}>
        <ApiKeyRegenerateConfirmModal
          usersId={user()?.usersId!}
        />
        <h1 class="type-display-1 text-sky-120">OpenAQ Account</h1>
        <section class={style['account-page__section']}>
          <h2 class="type-heading-2  text-sky-120">Basics</h2>
          <div class={style['form-element']}>
            <label for="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              class="text-input"
              value={user()?.fullName}
            />
          </div>

          <div class={style['form-element']}>
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
        <section class={style['account-page__section']}>
          {' '}
          <h2 class="type-heading-2  text-sky-120">
            Change password
          </h2>
          <PasswordForm />
        </section>
        <section class={style['account-page__section']}>
            <h2 class="type-heading-2 text-sky-120">API Key</h2>
            <input class="text-input" value={user()?.token}></input>
            <div class={style['api-key-buttons']}>
            <button
              class="btn btn-primary"
              onClick={() => {
                copyApiKey(user()?.token)
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
        <Toast message={'API Key copied to clipboard'}/>
      </main>
    </>
  );
}
