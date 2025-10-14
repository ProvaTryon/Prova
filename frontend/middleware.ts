import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './lib/i18n-config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Default locale
  defaultLocale,
  
  // Don't use locale prefix for default locale
  // This means /shop works (defaults to /en/shop internally)
  localePrefix: 'as-needed',
  
  // Always use locale detection
  localeDetection: true
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
    '/(ar|en)/:path*'
  ]
};
