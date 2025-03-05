import { useSubmission } from '@solidjs/router';
import { JSX, Show, createEffect, createSignal } from 'solid-js';
import { useStore } from '~/stores';
import DeleteForeverIcon from '~/assets/imgs/delete_forever.svg';
import CloseIcon from '~/assets/imgs/close.svg';

import '~/assets/scss/components/modal.scss';
import { deleteListLocation } from '~/db/lists';

interface DeleteLocationModalDefinition {
  listsId: number;
}

export function DeleteLocationModal(props: DeleteLocationModalDefinition) {
  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '#FFFFFF',
  };
  const [ref, setRef] = createSignal<HTMLDialogElement>();

  const [store, { toggleDeleteListLocationModalOpen }] = useStore();
  const deletingListLocation = useSubmission(deleteListLocation);

  const onClickClose: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    toggleDeleteListLocationModalOpen();
    e.preventDefault();
    e.target.closest('dialog')!.close();
  };

  const onSubmitClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    e
  ) => {
    e.target.closest('dialog')!.close();
    toggleDeleteListLocationModalOpen();
  };

  createEffect(() => {
    if (store.deleteListLocationModalOpen) {
      ref()?.showModal();
    }
  });

  return (
    <dialog class="modal" ref={setRef}>
      <form action={deleteListLocation} method="post">
        <header class="modal__header">
          <h2 class="title">
            <DeleteForeverIcon {...svgAttributes} />
            Remove location?
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
          <p>
            <span class="type-subtitle-4">Warning</span> You are about to remove
            this location from your list. Click Delete if you are you sure want
            to proceed.
          </p>
        </div>
        <footer class="modal__footer">
          <Show when={deletingListLocation.result}>
            <p style={{ color: 'red' }} role="alert" id="error-message">
              {deletingListLocation.result!.message}
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
          <input name="lists-id" type="hidden" value={props.listsId} />
          <input
            name="locations-id"
            type="hidden"
            value={store.listLocationsId}
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
