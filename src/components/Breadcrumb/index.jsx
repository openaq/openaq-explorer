import { Link } from '@solidjs/router';
import { useStore } from '../../stores';

export default function Breadcrumb() {
  const [store] = useStore();
  return (
    <div style="display:flex; align-items:center; gap: 6px; margin: 10px 0 30px 50px;">
      <a href="https://openaq.org">
        <span class="material-symbols-outlined green">home</span>
      </a>
      <span class="material-symbols-outlined">chevron_right</span>
      <Link href="/" className="type-link-3 text-sky-120">
        Explore the data
      </Link>
      <span class="material-symbols-outlined">chevron_right</span>
      <span className="type-body-3 text-sky-120">
        {store.location?.name}
      </span>
    </div>
  );
}
