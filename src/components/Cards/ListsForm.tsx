import { A, createAsync } from '@solidjs/router';
import { For, JSX, createSignal } from 'solid-js';
import { useStore } from '~/stores';

import '~/assets/scss/components/lists-form.scss';
import { addRemoveSensorNodesList, getUserLists } from '~/db/lists';
import ListsIcon from '~/assets/imgs/lists.svg';

interface ListsFormDefinition {
  redirect: string | undefined;
}

function ListToggle(props: any) {
  const [store] = useStore();

  let radioOnRef: HTMLInputElement;
  let radioOffRef: HTMLInputElement;

  const onButtonClick: JSX.EventHandler<HTMLButtonElement, Event> = (e) => {
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
    <div class="list-toggle">
      <label for={`list-${props.list.listsId}`} class="list-item-toggle">
        {props.list.label}
        <button
          onClick={(e) => onButtonClick(e)}
          class={`list-btn ${props.list.sensorNodesIds.indexOf(store.locationsId) !== -1 ? 'list-btn--active' : ''}`}
          value={String(
            props.list.sensorNodesIds.indexOf(store.locationsId) === -1
          )}
        >
          {props.list.sensorNodesIds.indexOf(store.locationsId) === -1 ? (
            <ListsIcon height={24} width={24} />
          ) : (
            <ListsIcon height={24} width={24} />
          )}
        </button>
      </label>

      <input
        class="radio-input"
        type="radio"
        ref={radioOnRef}
        name={`list-${props.list.listsId}`}
        id={`list-${props.list.listsId}-on`}
        value="1"
        checked={props.list.sensorNodesIds.indexOf(store.locationsId) !== -1}
      />
      <input
        class="radio-input"
        type="radio"
        ref={radioOffRef}
        name={`list-${props.list.listsId}`}
        id={`list-${props.list.listsId}-off`}
        value="0"
        checked={props.list.sensorNodesIds.indexOf(store.locationsId) === -1}
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
    <div class="list-form-container">
      <div class={`lists-form ${toggleDropdown() ? 'lists-form--open' : ''}`}>
        <form
          action={addRemoveSensorNodesList}
          method="post"
          class="list-modify-form"
        >
          <input
            type="hidden"
            name="sensor-nodes-id"
            value={store.locationsId}
          />
          <input type="hidden" name="redirect" value={props.redirect} />
          <div class="lists-list">
            <For each={lists()}>{(list) => <ListToggle list={list} />}</For>
          </div>
        </form>
      </div>
      {lists()?.length === 0 ? (
        <A class="icon-btn btn-secondary" href="/lists">
          Add to list
          <ListsIcon height={24} width={24} fill="#0000ff" stroke="#ff0000" />
        </A>
      ) : (
        <button
          class="icon-btn btn-secondary"
          onClick={() => onClickAddToList()}
        >
          Add to list
          <ListsIcon height={24} width={24} fill="#0000ff" stroke="#ff0000" />
        </button>
      )}
    </div>
  );
}
