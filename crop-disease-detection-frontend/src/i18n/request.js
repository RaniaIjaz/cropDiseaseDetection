import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
 });

// import {getRequestConfig} from 'next-intl/server';
 
// export default getRequestConfig(async () => {
//   // Static for now, we'll change this later
//   const locale = 'ur';
 
//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });


// import {getRequestConfig} from 'next-intl/server';
// import {routing} from './routing';

// export default getRequestConfig(async ({requestLocale}) => {
//   // Get the locale from the request
//   let locale = await requestLocale;
  
//   // Validate that the locale is supported, fallback to default if not
//   if (!locale || !routing.locales.includes(locale)) {
//     locale = routing.defaultLocale;
//   }
 
//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });