import { useSubmission } from '@solidjs/router';
import { JSX, Show, createEffect } from 'solid-js';
import { useStore } from '~/stores';

import '~/assets/scss/components/modal.scss';
import { regenerateKey } from '~/db/account';


interface Props {
  token?: string;
}

export function ApiKeyRegenerateConfirmModal(props: Props) {
  const [store, { toggleRegenerateKeyModalOpen }] = useStore();

  const onClickClose: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e) => {
    toggleRegenerateKeyModalOpen();
    e.preventDefault();
    e.target.closest('dialog')!.close();
  };

  let ref: HTMLDialogElement | undefined;

  createEffect(() => {
    if (store.apiKeyRegenerateModalOpen) {
      ref?.showModal();
    }
  });

  const onSubmit: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e) => {
    e.target.closest('dialog')!.close();
    toggleRegenerateKeyModalOpen();
  };

  const regeneratingKey = useSubmission(regenerateKey);

  return (
    <dialog class="modal" ref={ref}>
      <form action={regenerateKey} name="regenerate-key-form" id="regenerate-key-form" method="post">
        <header class="modal__header">
          <h2>Regenerate API Key</h2>
          <button
            id="close"
            class='close-btn'
            aria-label="close"
            formnovalidate
            onClick={onClickClose}
          >
            <img src="/svgs/close.svg" alt="close icon" />
          </button>
        </header>
        <div class="modal__body">
          Warning: The current key will stop working when a new key is
          regenerated
        </div>
        <footer class="modal__footer">
          <button
            class="btn btn-secondary"
            id="cancel"
            aria-label="close"
            formnovalidate
            onClick={onClickClose}
            autofocus
          >
            Cancel
          </button>
          <Show when={regeneratingKey.result}>
            <p
              style={{ color: 'red' }}
              role="alert"
              id="error-message"
            >
              {regeneratingKey.result?.message}
            </p>
          </Show>
          <input type="hidden" name="token" value={props.token} />
          <button
            class="btn btn-primary"
            type="submit"
            autofocus
            onClick={onSubmit}
          >
            Regenerate
          </button>
        </footer>
      </form>
    </dialog>
  );
}

