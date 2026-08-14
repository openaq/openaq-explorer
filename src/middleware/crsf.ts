import type { FetchEvent } from '@solidjs/start/server';

function getHost(url: string) {
  try {
    return new URL(url)?.host || null;
  } catch {
    return null;
  }
}

function verifyRequestOrigin(origin: string, allowedDomains: string[]) {
  if (!origin || allowedDomains.length === 0) {
    return false;
  }
  const originHost = getHost(origin);
  if (!originHost) {
    return false;
  }
  for (const domain of allowedDomains) {
    const host = domain.startsWith('http://') || domain.startsWith('https://')
      ? getHost(domain)
      : getHost('https://' + domain);
    if (originHost === host) {
      return true;
    }
  }
  return false;
}

export function csrfProtection(event: FetchEvent): Response | void {
  if (event.request.method === 'GET') {
    return;
  }
  const originHeader =
    event.request.headers.get('Origin') || event.request.headers.get('Referer');
  const hostHeader = event.request.headers.get('Host');

  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    console.info(`Invalid origin request: ${originHeader} ${hostHeader}`);
    return new Response(null, { status: 403 });
  }
}
