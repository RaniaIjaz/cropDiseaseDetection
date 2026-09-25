import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { routing } from "@/i18n/routing";
import ClientWrapper from "./Client";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-app-sans",
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-app-urdu",
});

export const metadata = {
  title: "AgriDoctor — Wheat & Cotton Disease Detection",
  description:
    "Upload a wheat or cotton leaf image and get an instant AI diagnosis with treatment and prevention guidance.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3d9970",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    messages = {};
  }

  return (
    <html
      lang={locale}
      dir={locale === "ur" ? "rtl" : "ltr"}
      className={`${inter.variable} ${nastaliq.variable}`}
    >
      <body className="min-h-screen bg-white text-ink antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientWrapper>{children}</ClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
