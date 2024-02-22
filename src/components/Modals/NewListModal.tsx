import { useSubmission } from '@solidjs/router';
import style from './NewListModal.module.scss';
import { newListAction } from '~/db';
import { JSX, Show, createEffect } from 'solid-js';
import { useStore } from '~/stores';

interface NewListModalDefinition {
  usersId: number;
}

export function NewListModal(props: NewListModalDefinition) {

  const [store, {toggleNewListModalOpen}] = useStore();
  const creatingNewList = useSubmission(newListAction);

  const onClickClose: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    toggleNewListModalOpen()
    e.preventDefault();
    e.target.closest('dialog')!.close();
  };

  let ref: HTMLDialogElement | undefined;

  createEffect(() => {
    if (store.newListModalOpen) {
      ref?.showModal();
    }
  });

  const onSubmit = () => {
    toggleNewListModalOpen()
  }
  
  return (
    <dialog class="modal" ref={ref}>
      <form action={newListAction} method="post">
        <header class="modal__header">
          <h2 class={style['title']}>
            <img src="/svgs/add_white.svg" alt="add icon" />
            New list
          </h2>
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
          <div class={style['form-input']}>
            <input
              type="hidden"
              name="users-id"
              value={props.usersId}
            />
            <label for="list-name">Name</label>

            <div class={style['form-input']}>
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
            <p
              style={{ color: 'red' }}
              role="alert"
              id="error-message"
            >
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
          <button class="btn btn-primary" type="submit" onClick={() => onSubmit()} autofocus>
            Create
          </button>
        </footer>
      </form>
    </dialog>
  );
}
