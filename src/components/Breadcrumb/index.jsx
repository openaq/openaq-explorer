import { Link } from '@solidjs/router';
import { useStore } from '../../stores';

export default function Breadcrumb() {
  const [store] = useStore();
  return (
    <div class="breadcrumb">
      <a class="breadcrumb-home" href="https://openaq.org">
        <span class="material-symbols-outlined green">home</span>
      </a>
      <span class="material-symbols-outlined">chevron_right</span>
      <Link href="/" class="breadcrumb-explore">
        Explore the data
      </Link>
      <span class="material-symbols-outlined">chevron_right</span>
      <span class="breadcrumb-current-page">
        {store.location?.name}
      </span>
    </div>
  );
}
