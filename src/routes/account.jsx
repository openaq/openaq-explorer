import { useRouteData } from 'solid-start';
import { getUser } from '~/db/session';
import {
  createServerAction$,
  createServerData$,
} from 'solid-start/server';

import closeSvg from '~/assets/imgs/close.svg';

function Modal(props) {
  return (
    <dialog class="modal" ref={props.ref}>
      <header class="modal__header">
        <h2>Regenerate API Key</h2>
        <form>
          <button
            class="close-btn"
            value="cancel"
            formmethod="dialog"
          >
            <img src={closeSvg} alt="close icon" />
          </button>
        </form>
      </header>
      <div class="modal__body">
        Warning: The current key will stop working when a new key is
        regenerated
      </div>
      <footer class="modal__footer">
        <form>
          <button
            value="cancel"
            formmethod="dialog"
            class="btn btn-secondary"
          >
            Cancel
          </button>
        </form>
        <button class="btn btn-primary" autofocus>
          Regenerate
        </button>
      </footer>
    </dialog>
  );
}

function NameForm(props) {
  const [changingName, { Form }] = createServerAction$(
    async (form) => {}
  );

  return (
    <Form>
      <div class="form-element">
        <label for="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          class="text-input"
          value={props.fullName}
        />
      </div>

      <div class="form-element">
        <label for="name">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          class="text-input"
          value={props.emailAddress}
        />
      </div>

      <div class="form-element-row">
        <label for="subscribe">Subscribe to email newsletter</label>
        <input
          type="checkbox"
          name="subscribe"
          id="subscribe"
          class="checkbox"
        />
      </div>
      <div class="form-element">
        <button type="submit" class="btn btn-primary">
          Save changes
        </button>
      </div>
    </Form>
  );
}

function PasswordForm() {
  const [changingPassword, { Form }] = createServerAction$(
    async (form) => {}
  );

  return (
    <Form>
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
        <button type="submit" class="btn btn-primary">
          Change password
        </button>
      </div>
    </Form>
  );
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);
    return user;
  });
}

export default function Acount() {
  const user = useRouteData();

  const copyApiKey = () => {
    navigator.clipboard.writeText(user().token);
  };

  let dialog;

  return (
    <main class="account-page">
      <Modal ref={dialog} />
      <h1 class="type-display-1 text-sky-120">OpenAQ Account</h1>
      <section class="account-page__section">
        <h2 class="type-heading-2  text-sky-120">Basics</h2>
        <NameForm
          fullName={user()?.fullName}
          emailAddress={user()?.emailAddress}
        />
      </section>
      <section class="account-page__section">
        <h2 class="type-heading-2  text-sky-120">Change password</h2>
        <PasswordForm />
      </section>
      <section class="account-page__section">
        <div class="form-element">
          <h2 class="type-heading-2  text-sky-120">API Key</h2>
          <div>{user()?.token}</div>
          <button class="btn btn-primary" onClick={copyApiKey()}>
            Copy
          </button>
          <button
            class="btn btn-primary"
            onClick={() => dialog.showModal()}
          >
            Regenerate
          </button>
        </div>
      </section>
      <section class="account-page__section">
        <h2 class="type-heading-2  text-sky-120">Delete account</h2>
        <button class="btn">Delete OpenAQ Account</button>
      </section>
    </main>
  );
}
