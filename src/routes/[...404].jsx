import { HttpStatusCode } from '@solidjs/start';
import '~/assets/scss/routes/page-not-found.scss';
import { Header } from '~/components/Header';
import { NotFoundMessage } from '~/components/NotFoundMessage/NotFoundMessage';

export default function NotFound() {
  return (
    <>
      <HttpStatusCode code={404} />
      <main>
        <Header />
        <NotFoundMessage />
      </main>
    </>
  );
}
