"use client";

import { useState } from "react";
import { SectionTitle } from "./SectionTitle";

const FAQS = [
  {
    q: "What is AQI and how is it calculated?",
    a: "AQI (Air Quality Index) is a standardized 0–500 scale. BeyondAQI calculates it from raw PM₂.₅, PM₁₀, O₃, NO₂, SO₂, and CO sensor readings using the sub-index formula for each pollutant, taking the highest as the final AQI. No averaging or interpolation applied.",
  },
  {
    q: "How is BeyondAQI different from government AQI apps?",
    a: "Government platforms (CPCB, SAFAR) update AQI once per 24 hours and average readings over large areas. BeyondAQI refreshes every 30 minutes from ground-level IoT sensors — giving you what's actually in the air right now, at street level, with zero data smoothing.",
  },
  {
    q: "What is PM₂.₅ and why does it matter most?",
    a: "PM₂.₅ refers to particles 2.5 micrometers or smaller — about 30× thinner than a human hair. These particles penetrate deep into the lungs and enter the bloodstream, causing cardiovascular and respiratory disease. WHO 2021 safe limit is 15 µg/m³ annual mean.",
  },
  {
    q: "How many sensors does BeyondAQI operate across India?",
    a: "BeyondAQI currently operates 200+ hyperlocal IoT sensor stations across India. Each station measures PM₂.₅, PM₁₀, CO, SO₂, NO₂, and O₃ at 1-minute intervals, transmitted via 4G/5G to our cloud pipeline. The network expands every quarter.",
  },
  {
    q: "Can I get BeyondAQI data via API for my app or research?",
    a: "Yes — BeyondAQI offers a developer API with historical and real-time endpoints. Academic researchers and NGOs get discounted or free access. Commercial API access with SLA guarantees is available. Contact us at api@beyondaqi.in for documentation and API keys.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="sec-faq"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionTitle className="mb-10 text-center">
          Frequently Asked Questions
        </SectionTitle>

        <div className="flex flex-col gap-2.5">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-[14px] border border-sky-400/10 bg-bqa-navy2/70 backdrop-blur-md transition-colors hover:border-sky-400/20"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.95rem] font-semibold text-bqa-text transition-colors hover:bg-bqa-slate sm:px-6"
                >
                  {item.q}
                  <span
                    className={`shrink-0 text-2xl leading-none text-bqa-accent transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-sky-400/10 px-5 pb-4 pt-4 text-[0.9rem] leading-relaxed text-bqa-muted sm:px-6">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
