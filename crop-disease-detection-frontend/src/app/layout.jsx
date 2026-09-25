// The `[locale]` layout owns <html> and <body> so it can set `lang` and `dir`
// per locale. Rendering them here as well produced nested <html>/<body>, which
// the browser strips at parse time and which broke hydration on every page.
export default function RootLayout({ children }) {
  return children;
}
