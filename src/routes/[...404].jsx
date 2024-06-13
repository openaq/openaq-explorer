import { HttpStatusCode } from '@solidjs/start';
import '~/assets/scss/routes/page-not-found.scss';
import { Header } from '~/components/Header';

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <HttpStatusCode code={404} />
        <section class="page-404">
          <div class="bubble-lg" />
          <div class="bubble-sm" />
          <h1 class="type-heading-1">
            Uh oh! We can't find the page you've requested
          </h1>
        </section>
      </main>
    </>
  );
}
