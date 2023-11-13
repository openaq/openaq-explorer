import { useRouteData } from 'solid-start';
import { getUser } from '~/db/session';
import {
  createServerAction$,
  createServerData$,
  redirect,
} from 'solid-start/server';
function NameForm(props) {
  const [changingName, { Form }] = createServerAction$(
    async (form) => {}
  );

  return (
    <Form>
      <label for="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={props.fullName}
      />
      <label for="name">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        value={props.emailAddress}
      />
      <label for="subscribe">Subscribe to email newsletter</label>
      <input type="checkbox" name="subscribe" id="subscribe" />
      <button type="submit">Save changes</button>
    </Form>
  );
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);
    return user;
  });
}

export default function AcountDelete() {
  const data = useRouteData();
  return (
    <main>
      <h1>Delete Account</h1>
      <section>
        <h2>Basics</h2>
        <NameForm
          fullName={data().fullName}
          emailAddress={data().emailAddress}
        />
      </section>
      <section>
        <h2>Delete account</h2>
        <button>Delete OpenAQ Account</button>
      </section>
    </main>
  );
}
