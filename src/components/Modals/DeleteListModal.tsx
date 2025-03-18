import { useSubmission } from '@solidjs/router';
import { JSX, Show, createEffect, createSignal } from 'solid-js';
import { useStore } from '~/stores';
import '~/assets/scss/components/modal.scss';
import { deleteList } from '~/db/lists';
import DeleteForeverIcon from '~/assets/imgs/delete_forever.svg';
import CloseIcon from '~/assets/imgs/close.svg';

export function DeleteListModal() {
  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '#FFFFFF',
  };
  const [ref, setRef] = createSignal<HTMLDialogElement>();

  const [store, { toggleDeleteListModalOpen }] = useStore();
  const deletingList = useSubmission(deleteList);

  const onClickClose: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    toggleDeleteListModalOpen();
    e.preventDefault();
    e.target.closest('dialog')!.close();
  };

  const onSubmitClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    e
  ) => {
    e.target.closest('dialog')!.close();
    toggleDeleteListModalOpen();
  };

  createEffect(() => {
    if (store.deleteListModalOpen) {
      ref()?.showModal();
    }
  });

  return (
    <dialog class="modal" ref={setRef}>
      <form action={deleteList} method="post">
        <header class="modal__header">
          <h2 class="title">
            <DeleteForeverIcon {...svgAttributes} />
            Delete list
          </h2>
          <button
            id="close"
            class="close-btn"
            aria-label="close"
            formnovalidate
            onClick={onClickClose}
          >
            <CloseIcon {...svgAttributes} />
          </button>
        </header>

        <div class="modal__body">
          <p class="type-subtitle-3">Delete Warning</p>
          <p>
            <span class="type-subtitle-4">Warning</span> You are about to delete
            a list, this cannot be undone. Click Delete if you are sure you want
            to proceed.
          </p>
        </div>
        <footer class="modal__footer">
          <Show when={deletingList.result}>
            <p style={{ color: 'red' }} role="alert" id="error-message">
              {deletingList.result!.message}
            </p>
          </Show>
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
          <input type="hidden" name="lists-id" value={store.listsId} />
          <button
            class="btn btn-primary"
            type="submit"
            onClick={onSubmitClick}
            autofocus
          >
            Delete
          </button>
        </footer>
      </form>
    </dialog>
  );
}
