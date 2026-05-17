"use client";

import { RealtimeAqiGoogleMap } from "./RealtimeAqiGoogleMap";

type MapModalProps = {
  open: boolean;
  onClose: () => void;
};

export function MapModal({ open, onClose }: MapModalProps) {
  return (
    <div
      className={`fixed inset-0 z-[500] flex items-center justify-center bg-bqa-navy/85 backdrop-blur-sm transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className={`flex h-[80vh] w-[90%] max-w-[1000px] flex-col rounded-[20px] border border-sky-400/10 bg-bqa-navy2 shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-5"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sky-400/10 px-5 py-4">
          <div className="flex items-center gap-2.5 text-base font-bold text-bqa-text">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-bqa-unhealthy shadow-[0_0_8px_#ff4d6d]"
              aria-hidden
            />
            BeyondAQI Sensor Map — All India
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border-0 bg-transparent text-3xl leading-none text-bqa-muted transition-colors hover:text-bqa-text"
            aria-label="Close map"
          >
            ×
          </button>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-[20px]">
          <RealtimeAqiGoogleMap className="h-full min-h-[400px]" />
        </div>
      </div>
    </div>
  );
}
