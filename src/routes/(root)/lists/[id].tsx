import { createAsync, Params, useParams } from '@solidjs/router';
import { TabView } from '~/components/TabView';
import { EditListModal } from '~/components/Modals/EditListModal';
import { DeleteLocationModal } from '~/components/Modals/DeleteLocationModal';
import { Show } from 'solid-js';
import { A } from '@solidjs/router';
import { useStore } from '~/stores';

import '~/assets/scss/routes/list-detail.scss';
import { getLoggedInUser } from '~/auth/user';
import { getList, listLocations } from '~/db/lists';

export const route = {
  preload: ({ params }: { params: Params }) => {
    getLoggedInUser();
    listLocations(Number(params.id));
    getList(Number(params.id));
  },
};

export default function List() {
  const [_, { toggleEditListModalOpen }] = useStore();

  const { id } = useParams();

  createAsync(() => getLoggedInUser(), { deferStream: true });

  const locations = createAsync(() => listLocations(Number(id)), {
    deferStream: true,
  });
  const list = createAsync(() => getList(Number(id)), { deferStream: true });

  return (
    <>
      <main class="list-detail-main">
        <header class="header">
          <Show when={list()}>
            <div class="title">
              <A href="/lists">
                <img src="/svgs/arrow_left_sky120.svg" alt="" />
              </A>{' '}
              <div>
                <div class="list-name">
                  <h1 class="type-display-1 gradient-title">{list().label}</h1>
                  <button
                    class="button-reset"
                    onClick={() => toggleEditListModalOpen()}
                  >
                    <img src="/svgs/edit_smoke120.svg" alt="edit icon" />
                  </button>
                </div>
                <span class="type-subtitle-2 text-smoke-120">
                  {list()?.description}
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
