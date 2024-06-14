import { useSubmission } from '@solidjs/router';
import { updateListAction } from '~/db';
import { JSX, Show, createEffect } from 'solid-js';
import { useStore } from '~/stores';
import '~/assets/scss/components/modal.scss';

interface EditListModalDefinition {
  listsId: number;
  label: string;
  description: string;
}

export function EditListModal(props: EditListModalDefinition) {
  const [store, { toggleEditListModalOpen }] = useStore();
  const updatingList = useSubmission(updateListAction);

  const onClickClose: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e) => {
    toggleEditListModalOpen();
    e.preventDefault();
    e.target.closest('dialog')!.close();
  };

  let ref: HTMLDialogElement | undefined;

  createEffect(() => {
    if (store.editListModalOpen) {
      ref?.showModal();
    }
  });

  const onSubmit: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    e
  ) => {
    e.target.closest('dialog')!.close();
    toggleEditListModalOpen();
  };

  return (
    <dialog class="modal" ref={ref}>
      <form action={updateListAction} method="post">
        <input type="hidden" name="lists-id" value={props.listsId} />
        <header class="modal__header">
          <h2 class='title'>
            <img src="/svgs/edit_white.svg" alt="add icon" />
            Edit list
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
          <div class='form-input'>
            <label for="list-name">Name</label>

            <div class='form-input'>
              <input
                type="text"
                name="list-name"
                id="list-name-input"
                class="text-input"
                value={props.label}
              />
            </div>
            <label for="list-description">Description</label>

            <input
              type="text"
              name="list-description"
              id="list-description-input"
              class="text-input"
              value={props.description}
            />
          </div>
        </div>
        <footer class="modal__footer">
          <Show when={updatingList.result}>
            <p
              style={{ color: 'red' }}
              role="alert"
              id="error-message"
            >
              {updatingList.result!.message}
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
          <button
            class="btn btn-primary"
            type="submit"
            onClick={(e) => onSubmit(e)}
            autofocus
          >
            Create
          </button>
        </footer>
      </form>
    </dialog>
  );
}
