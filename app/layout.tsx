import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

/**
 * Self-hosted by Next at build time and exposed as `--font-inter` (see tailwind.config.ts).
 * Loading it here rather than through a hand-written `<head>` keeps `<head>` entirely
 * Next-managed — React never hydrates it, so anything a browser extension injects in there
 * can no longer produce a "server HTML does not match" mismatch.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Atovio BeyondAQI Web",
  description: "Atovio BeyondAQI Web Application",
  applicationName: "BeyondAQI",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Atovio BeyondAQI Web",
    title: "Atovio BeyondAQI Web",
    description: "Atovio BeyondAQI Web Application",
  },
  twitter: {
    card: "summary",
    title: "Atovio BeyondAQI Web",
    description: "Atovio BeyondAQI Web Application",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050a14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/**
 * Runs before hydration, so it still fires when hydration itself fails.
 *
 * A service worker registered by an earlier production build keeps serving its cached
 * document on http://localhost, which no longer matches what the dev server sends — the
 * page then dies during hydration, and because ServiceWorkerProvider's cleanup lives in a
 * React effect, it never runs and the tab stays stuck across reloads. Tearing the worker
 * and its caches down here breaks that loop without React's help.
 */
const KILL_STALE_SERVICE_WORKER = `
(function () {
  try {
    var h = location.hostname;
    if (h !== "localhost" && h !== "127.0.0.1" && h !== "[::1]") return;
    if (!("serviceWorker" in navigator)) return;
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.getRegistrations()
      .then(function (regs) {
        return Promise.all(regs.map(function (r) { return r.unregister(); }));
      })
      // Runs unconditionally: a worker that repopulated its cache on its way out would
      // otherwise leave entries behind that nothing ever cleans up.
      .then(function () {
        return window.caches ? caches.keys().then(function (keys) {
          return Promise.all(keys.map(function (k) { return caches.delete(k); }));
        }) : null;
      })
      .then(function () {
        if (hadController && !sessionStorage.getItem("sw-cleared")) {
          sessionStorage.setItem("sw-cleared", "1");
          location.reload();
        }
      });
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* Extensions routinely add attributes to <html>/<body> before React hydrates; without
       this, those edits are reported as hydration mismatches. */
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Script
          id="kill-stale-service-worker"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: KILL_STALE_SERVICE_WORKER }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
