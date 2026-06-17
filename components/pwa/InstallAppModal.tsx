"use client";

import { useEffect } from "react";

interface InstallAppModalProps {
  open: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

function PhoneIcon() {
  return (
    <svg
      className="h-7 w-7 text-bqa-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

export function InstallAppModal({
  open,
  onInstall,
  onDismiss,
}: InstallAppModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
        aria-label="Close install dialog"
        onClick={onDismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-app-title"
        aria-describedby="install-app-description"
        className="relative w-full max-w-[26rem] overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-b from-[#0f1c32] to-[#060d1a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(61,158,255,0.08)] sm:p-7"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-bqa-good via-bqa-accent to-bqa-severe"
          aria-hidden
        />

        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80"
          aria-label="Close"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-sky-400/20 bg-[#050a14]/80 shadow-[0_0_24px_rgba(61,158,255,0.18)]">
          <PhoneIcon />
        </div>

        <h2
          id="install-app-title"
          className="mb-2 font-sans text-xl font-bold tracking-tight text-bqa-text"
        >
          Install BeyondAQI
        </h2>
        <p
          id="install-app-description"
          className="mb-6 text-[0.9rem] leading-relaxed text-bqa-muted"
        >
          Add BeyondAQI to your home screen for quick access to live AQI data,
          sensor maps, and health guidance — even when you&apos;re offline.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onInstall}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-bqa-accent px-5 py-3 text-[0.9rem] font-semibold text-white shadow-[0_4px_20px_rgba(61,158,255,0.35)] transition-all hover:brightness-110"
          >
            <DownloadIcon />
            Install App
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-3 text-[0.9rem] font-semibold text-bqa-text transition-colors hover:border-sky-400/30 hover:bg-white/[0.04]"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
