import { useSubmission } from '@solidjs/router';
import { JSX, Show, createEffect, createSignal } from 'solid-js';
import { useStore } from '~/stores';
import '~/assets/scss/components/modal.scss';
import { createList } from '~/db/lists';
import AddIcon from '~/assets/imgs/add.svg';
import CloseIcon from '~/assets/imgs/close.svg';

const svgAttributes = {
  width: 24,
  height: 24,
  fill: '#FFFFFF',
};

interface NewListModalDefinition {
  usersId: number;
}

export function NewListModal(props: NewListModalDefinition) {
  const [store, { toggleNewListModalOpen }] = useStore();
  const creatingNewList = useSubmission(createList);

  const onClickClose: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    toggleNewListModalOpen();
    e.preventDefault();
    e.target.closest('dialog')!.close();
  };

  const [ref, setRef] = createSignal<HTMLDialogElement>();

  createEffect(() => {
    if (store.newListModalOpen) {
      ref()?.showModal();
    }
  });

  const onSubmit = () => {
    toggleNewListModalOpen();
  };

  return (
    <dialog class="modal" ref={setRef}>
      <form action={createList} method="post">
        <header class="modal__header">
          <h2 class="title">
            <AddIcon {...svgAttributes} />
            New list
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
          <div class="form-input">
            <input type="hidden" name="users-id" value={props.usersId} />
            <label for="list-name">Name</label>

            <div class="form-input">
              <input
                type="text"
                name="list-name"
                id="list-name-input"
                class="text-input"
              />
            </div>
            <label for="list-description">Description</label>

            <input
              type="text"
              name="list-description"
              id="list-description-input"
              class="text-input"
            />
          </div>
        </div>
        <footer class="modal__footer">
          <Show when={creatingNewList.result}>
            <p style={{ color: 'red' }} role="alert" id="error-message">
              {creatingNewList.result!.message}
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
            onClick={() => onSubmit()}
            autofocus
          >
            Create
          </button>
        </footer>
      </form>
    </dialog>
  );
}
