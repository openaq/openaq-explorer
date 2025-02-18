import { createAsync, useParams } from '@solidjs/router';

import { Params } from '@solidjs/router';
import { verifyEmail } from '~/auth/user';

export const route = {
  preload: ({ params }: { params: Params }) => verifyEmail(params.code),
};

export default function Verify() {
  const { code } = useParams();
  createAsync(() => verifyEmail(code), { deferStream: true });

  return <></>;
}
