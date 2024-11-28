import { useSubmission } from '@solidjs/router';
import { JSX, Show, createEffect } from 'solid-js';
import { useStore } from '~/stores';
import '~/assets/scss/components/modal.scss';
import { deleteList } from '~/db/lists';



export function DeleteListModal() {
  let ref: HTMLDialogElement | undefined;

  const [store, { toggleDeleteListModalOpen }] = useStore();
  const deletingList = useSubmission(deleteList);

  const onClickClose: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e) => {
    toggleDeleteListModalOpen();
    e.preventDefault();
    e.target.closest('dialog')!.close();
  };

  const onSubmitClick: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e) => {
    e.target.closest('dialog')!.close();
    toggleDeleteListModalOpen();
  };

  createEffect(() => {
    if (store.deleteListModalOpen) {
      ref?.showModal();
    }
  });

  return (
    <dialog class="modal" ref={ref}>
      <form action={deleteList} method="post">
        <header class="modal__header">
          <h2 class='title'>
            <img
              src="/svgs/delete_forever_white.svg"
              alt="add icon"
            />
            Delete list
          </h2>
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
          <p class="type-subtitle-3">Delete Warning</p>
          <p>
            <span class="type-subtitle-4">Warning</span> You are about
            to delete a list, this cannot be undone. Click Delete if
            you are you sure want to proceed.
          </p>
        </div>
        <footer class="modal__footer">
          <Show when={deletingList.result}>
            <p
              style={{ color: 'red' }}
              role="alert"
              id="error-message"
            >
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
          <input
            type="hidden"
            name="lists-id"
            value={store.listsId}
          />
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
