/**
 * Service Worker Provider Component
 * Handles service worker registration and PWA installation prompt
 */

"use client";

import { useEffect, useState } from "react";
import {
  registerServiceWorker,
  unregisterServiceWorker,
} from "@/lib/pwa/service-worker-register";
import { InstallAppModal } from "./InstallAppModal";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const loopback =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]";

    // Disable SW on localhost and in dev — prevents intercepting /api, /_next, and HMR.
    if (process.env.NODE_ENV === "development" || loopback) {
      unregisterServiceWorker();
      return;
    }

    registerServiceWorker();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is running in standalone mode");
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <>
      {children}
      <InstallAppModal
        open={showInstallPrompt}
        onInstall={handleInstallClick}
        onDismiss={() => setShowInstallPrompt(false)}
      />
    </>
  );
}
