import { ListCard } from '~/components/ListCard';
import { getUser, getUserLists } from '~/db';
import { createAsync } from '@solidjs/router';
import { NewListModal } from '~/components/Modals/NewListModal';
import { DeleteListModal } from '~/components/Modals/DeleteListModal';
import { For, createSignal } from 'solid-js';
import { Show } from 'solid-js';
import { useStore } from '~/stores';

import '~/assets/scss/routes/lists.scss';
import { Header } from '~/components/Header';

export const route = {
  load: () => {
    getUser(), getUserLists();
  },
};

export default function Lists() {


  const [store, {toggleNewListModalOpen}] = useStore();
  
  const userLists = createAsync(() => getUserLists(), {
    deferStream: true,
  });
  const user = createAsync(() => getUser(), { deferStream: true });

  return (
    <>
      <Header />
      <main class="lists-main">

        <header class='header'>
          <div class='title'>
            <h1 class="type-display-1 gradient-title">My lists</h1>
            <Show when={userLists() && userLists()!.length === 5}>
              <span class='list-length-alert'>
                <img
                  src="/svgs/warning_corn100.svg"
                  alt="warning icon"
                />
                Maximum of 5 lists reached.
              </span>
            </Show>
          </div>
          <Show when={userLists()}>
            <button
              class={`icon-btn btn-primary ${
                userLists()!.length < 5 ? '' : 'btn-primary--disabled'
              }`}
              onClick={() => toggleNewListModalOpen()}
              disabled={userLists()!.length < 6 ? false : true}
            >
              Create new list <img src="/svgs/add_white.svg" alt="" />
            </button>
          </Show>
        </header>
        <ul class='lists-list'>
          <Show when={userLists()}>
            { userLists()?.length === 0 ? 
            <span class="type-body-3">You have no lists. Click "Create new list" button above to get started </span>
            :
            <For each={userLists()}>
            {(userList) => (
              <ListCard
                {...userList}
              />
            )}
          </For>
            }

          </Show>
        </ul>
        <Show when={user()}>
          <DeleteListModal />
          <NewListModal usersId={user()?.usersId!} />
        </Show>
      </main>
      </>
  );
}
