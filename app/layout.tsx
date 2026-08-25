import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth";
import { SITE_URL } from "@/lib/config/site";
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
  /** Resolves relative OG/Twitter URLs, and silences Next's metadataBase warning. */
  metadataBase: new URL(SITE_URL),
  title: "Atovio BeyondAQI Web",
  description: "Atovio BeyondAQI Web Application",
  applicationName: "BeyondAQI",
  icons: {
    /**
     * `_DT` is the light glyph for a dark tab strip, `_LT` the dark glyph for a light one.
     * Which applies follows the site's own theme toggle, not the OS — so this is only the
     * pre-hydration default, matching the dark theme the landing page boots into.
     * LandingExperience swaps the href from there whenever the toggle flips.
     *
     * Deliberately a single entry: `prefers-color-scheme` media queries would track the OS
     * rather than the toggle, and Chrome resolves competing <link rel=icon> tags by size
     * before anything else, so extra entries (the 192/512 PNGs that used to sit here) just
     * win and hide the brand mark. Those live on in manifest.ts, which is what install and
     * home-screen actually read.
     */
    icon: [{ url: "/beyondaqi_DT.ico", type: "image/x-icon" }],
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
