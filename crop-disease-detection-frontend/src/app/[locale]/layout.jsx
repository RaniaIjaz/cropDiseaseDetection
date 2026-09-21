
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing'; // Assuming you have a routing config
import ClientWrapper from './Client';

export default async function LocaleLayout({ children, params }) {
    const { locale } = await params;
  // Validate that the incoming `locale` is supported

    if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // const messages = await getMessages({ locale }); // Fetch messages for the specific locale
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    messages = {}; // Fallback to empty messages
  }

  return (
    <html lang={locale}>
      <body>
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientWrapper>
      {children}
      </ClientWrapper>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}