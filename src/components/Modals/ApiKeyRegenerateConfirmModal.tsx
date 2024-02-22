import { useSubmission } from '@solidjs/router';
import { JSX, Show, createEffect } from 'solid-js';
import style from './ApiKeyRegenerateModal.module.scss';
import { regenerateKeyAction } from '~/db';
import { useStore } from '~/stores';

interface ApiKeyModalDefinition {
  usersId: number;
}

export function ApiKeyRegenerateConfirmModal(
  props: ApiKeyModalDefinition
) {
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

  const regeneratingKey = useSubmission(regenerateKeyAction);

  return (
    <dialog class="modal" ref={ref}>
      <form action={regenerateKeyAction} method="post">
        <header class="modal__header">
          <h2>Regenerate API Key</h2>
          <button
            id="close"
            class={style['close-btn']}
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
          <input type="hidden" name="users-id" value={props.usersId} />
          <Show when={regeneratingKey.result}>
            <p
              style={{ color: 'red' }}
              role="alert"
              id="error-message"
            >
              {regeneratingKey.result!.message}
            </p>
          </Show>
          <button
            class="btn btn-primary"
            type="submit"
            onClick={(e) => onSubmit(e)}
            autofocus
          >
            Regenerate
          </button>
        </footer>
      </form>
    </dialog>
  );
}
