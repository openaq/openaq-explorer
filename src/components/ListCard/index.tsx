import { A } from '@solidjs/router';
import { useStore } from '~/stores';
import { ListCardMap } from '~/components/ListCardMap';

import '~/assets/scss/components/list-card.scss';

interface ListCardDefintion {
  listsId: number;
  ownersId: number;
  usersId: number;
  role: string;
  label: string;
  description: string;
  visibility: boolean;
  userCount: number;
  locationsCount: number;
  sensorNodesIds: number[];
  bbox: number[][];
}

export function ListCard(props: ListCardDefintion) {
  const [store, { setDeleteListsId, toggleDeleteListModalOpen }] = useStore();

  return (
    <div class="list-card">
      <A href={`/lists/${props.listsId}`}>
        <div class="list-card__body">
          <div class="list-content">
            <ListCardMap {...props}></ListCardMap>
            <div class="list-info">
              <h1 class="type-heading-1 text-sky-120">{props.label}</h1>
              <p class="type-body-2">{props.description}</p>
              <p class="type-body-3">{props.locationsCount} Locations</p>
            </div>
          </div>
          <div></div>
        </div>
      </A>
      <button
        class="list-card-delete-btn"
        type="button"
        onClick={() => {
          setDeleteListsId(props.listsId);
          toggleDeleteListModalOpen();
        }}
      >
        <img
          src="/svgs/delete_forever_smoke120.svg"
          alt="delete forever icon"
        />
      </button>
    </div>
  );
}
