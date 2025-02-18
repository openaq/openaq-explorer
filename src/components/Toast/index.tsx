import { useStore } from '~/stores';
import '~/assets/scss/components/toast.scss';

interface ToastDefinition {
  message: string;
}

export function Toast(props: ToastDefinition) {
  const [store] = useStore();

  return (
    <div class={`toast ${store.toastOpen ? '' : 'toast--translate'}`}>
      <span class="type-body-3">{props.message}</span>
    </div>
  );
}
