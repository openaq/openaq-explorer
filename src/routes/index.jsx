import { Title } from 'solid-start';
import { getUser } from '~/db/session';
import { useRouteData } from 'solid-start';
import { createServerData$, redirect } from 'solid-start/server';

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    return user;
  });
}

export default function Home() {
  const user = useRouteData();

  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world! {user()?.userId}</h1>
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
