import { createAsync, useParams } from '@solidjs/router';
import { TabView } from '~/components/TabView';
import { EditListModal } from '~/components/Modals/EditListModal';
import { DeleteLocationModal } from '~/components/Modals/DeleteLocationModal';
import { getLocationsByListId, getList, getUser } from '~/db';
import { Show } from 'solid-js';
import { A } from '@solidjs/router';
import { useStore } from '~/stores';
import { Header } from '~/components/Header';

import '~/assets/scss/routes/list-detail.scss';

export const route = {
  load: ({ params }) => {
    getUser();
    getLocationsByListId(params.id);
    getList(params.id);
  },
};

export default function List() {
  const [store, { toggleEditListModalOpen }] = useStore();

  const { id } = useParams();

  const locations = createAsync(() => getLocationsByListId(id), {
    deferStream: true,
  });
  const list = createAsync(() => getList(id), { deferStream: true });

  return (
    <>
      <Header />
      <main class="list-detail-main">
        <header class="header">
          <Show when={list()}>
            <div class="title">
              <A href="/lists">
                <img src="/svgs/arrow_left_sky120.svg" alt="" />
              </A>{' '}
              <div>
                <div class="list-name">
                  <h1 class="type-display-1 gradient-title">
                    {list().label}
                  </h1>
                  <button
                    class="button-reset"
                    onClick={() => toggleEditListModalOpen()}
                  >
                    <img
                      src="/svgs/edit_smoke120.svg"
                      alt="edit icon"
                    />
                  </button>
                </div>
                <span class="type-subtitle-2 text-smoke-120">
                  {list().description}
                </span>
              </div>
            </div>
          </Show>
        </header>
        <section>
          <Show when={locations() && list()}>
            <TabView locations={locations()} list={list()} />
          </Show>
        </section>
        <Show when={list()}>
          <EditListModal {...list()} />
        </Show>
        <DeleteLocationModal listsId={id} />
      </main>
    </>
  );
}
