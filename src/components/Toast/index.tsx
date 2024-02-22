
import { useStore } from '~/stores';

import style from './Toast.module.scss';

interface ToastDefinition {
    message: string;
}


export function Toast(props: ToastDefinition) {

    const [store] = useStore()

    return (
        <div class={`${style['toast']} ${store.toastOpen ? '' : style['toast--translate']}`}>
            <span class="type-body-3">{props.message}</span>
        </div>

    )
}