import {
  A,
  createAsync,
  redirect,
  useLocation,
} from '@solidjs/router';
import { For, JSX, createEffect, createSignal } from 'solid-js';
import { getUserLists, sensorNodesListModifyAction } from '~/db';
import { useStore } from '~/stores';
import style from './ListsForm.module.scss';

interface ListsFormDefinition {
  redirect: string | undefined;
}

function ListToggle(props: any) {
  const [store] = useStore();

  let radioOnRef: HTMLInputElement;
  let radioOffRef: HTMLInputElement;

  const onButtonClick: JSX.EventHandler<HTMLButtonElement, Event> = (
    e
  ) => {
    e.preventDefault();
    const notInList = e.currentTarget.value == 'true' ? true : false;
    if (notInList) {
      radioOnRef.checked = true;
      radioOffRef.checked = false;
    } else {
      radioOffRef.checked = true;
      radioOnRef.checked = false;
    }
    const form = e.target.closest('form');
    form?.submit();
  };

  return (
    <div>
      <label
        for={`list-${props.list.listsId}`}
        class={style['list-item-toggle']}
      >
        {props.list.label}
        <button
          onClick={(e) => onButtonClick(e)}
          class={style['list-btn']}
          value={String(
            props.list.sensorNodesIds.indexOf(store.locationsId) ===
              -1
          )}
        >
          {props.list.sensorNodesIds.indexOf(store.locationsId) ===
          -1 ? (
            <img src="/svgs/lists_off.svg" alt="" />
          ) : (
            <img src="/svgs/lists.svg" alt="" />
          )}
        </button>
      </label>

      <input
        class={style['radio-input']}
        type="radio"
        ref={radioOnRef}
        name={`list-${props.list.listsId}`}
        id={`list-${props.list.listsId}-on`}
        value="1"
        checked={
          props.list.sensorNodesIds.indexOf(store.locationsId) !== -1
        }
        // onChange={onInputChange}
      />
      <input
        class={style['radio-input']}
        type="radio"
        ref={radioOffRef}
        name={`list-${props.list.listsId}`}
        id={`list-${props.list.listsId}-off`}
        value="0"
        checked={
          props.list.sensorNodesIds.indexOf(store.locationsId) === -1
        }
        // onChange={onInputChange}
      />
    </div>
  );
}

export function ListsForm(props: ListsFormDefinition) {
  const [store] = useStore();

  const lists = createAsync(() => getUserLists());

  const [toggleDropdown, setToggleDropdown] = createSignal(false);

  const onClickAddToList = () => {
    setToggleDropdown(!toggleDropdown());
  };

  return (
    <div class={style['list-form-container']}>
      <div
        class={`${style['lists-form']} ${
          toggleDropdown() ? style['lists-form--open'] : ''
        }`}
      >
        <form action={sensorNodesListModifyAction} method="post">
          <input
            type="hidden"
            name="sensor-nodes-id"
            value={store.locationsId}
          />
          <input
            type="hidden"
            name="redirect"
            value={props.redirect}
          />
          <div class={style['lists-list']}>
            <For each={lists()}>
              {(list, i) => <ListToggle list={list} />}
            </For>
          </div>
        </form>
      </div>
      {lists()?.length === 0 ? (
        <A class="icon-btn btn-secondary" href="/lists">
          Add to list <img src="/svgs/lists.svg" alt="" />
        </A>
      ) : (
        <button
          class="icon-btn btn-secondary"
          onClick={() => onClickAddToList()}
        >
          Add to list <img src="/svgs/lists.svg" alt="" />
        </button>
      )}
    </div>
  );
}
