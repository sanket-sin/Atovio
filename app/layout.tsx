import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth";
import { ServiceWorkerProvider } from "@/components/pwa";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atovio BeyondAQI Web",
  description: "Atovio BeyondAQI Web Application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BeyondAQI",
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
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="unregister-sw-loopback"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=location.hostname;if(h!=="localhost"&&h!=="127.0.0.1"&&h!=="[::1]")return;if(typeof navigator!=="undefined"&&navigator.serviceWorker){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister();});});}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
