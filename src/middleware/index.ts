import { createMiddleware } from '@solidjs/start/middleware';
import { csrfProtection } from './crsf';

export default createMiddleware({
  onRequest: [csrfProtection],
});
