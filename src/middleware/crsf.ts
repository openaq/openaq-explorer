import { type RequestMiddleware } from "@solidjs/start/middleware";
import { FetchEvent } from "@solidjs/start/server";
import { getHeader } from "vinxi/http";

function getHost(url: string) {
  try {
    return new URL(url)?.host || null;
  } catch {
    return null;
  }
}

function verifyRequestOrigin(origin: string, allowedDomains: string[]) {
  if (!origin || allowedDomains.length === 0) return false;
  const originHost = getHost(origin);

  if (!originHost) return false;

  for (const domain of allowedDomains) {
    let host: string | null;
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      host = getHost(domain);
    } else {
      host = getHost("https://" + domain);
    }
    if (originHost === host) return true;
  }
  return false;
}

function crsfCheck(event: FetchEvent) {
  if (event.request.method !== "GET") {
    const originHeader =
      (getHeader(event.nativeEvent, "Origin") ||
        getHeader(event.nativeEvent, "Referrer")) ??
      null;
    const hostHeader = getHeader(event.nativeEvent, "Host") ?? null;

    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      console.info(`Invalid origin request: ${originHeader} ${hostHeader}`)
      throw new Error("Invalid origin")
    }
  }
}

export const csrfProtection: RequestMiddleware = async (event) => {
    try {
        crsfCheck(event);
    } catch {
        event.nativeEvent.respondWith(new Response(null, { status: 403 }));
        return;
    }
};