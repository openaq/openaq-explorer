import { HttpStatusCode } from '@solidjs/start';
import styles from './PageNotFound.module.scss';

export default function NotFound() {
  return (
    <main>
      <HttpStatusCode code={404} />
      <section class={styles['page-404']}>
        <div class={styles['bubble-lg']} />
        <div class={styles['bubble-sm']} />
        <h1 class="type-heading-1">
          Uh oh! We can't find the page you've requested
        </h1>
      </section>
    </main>
  );
}
