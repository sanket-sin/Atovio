"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LiveAQITicker } from "./LiveAQITicker";

const NAV = [
  { href: "#sec-realtime-map", label: "Sensor Map" },
  { href: "#", label: "API" },
  { href: "#", label: "About" },
];

function scrollToRealtimeMap() {
  document
    .getElementById("sec-realtime-map")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingSiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeHint, setThemeHint] = useState<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState("");

  const navLinkClass =
    "text-sm font-medium text-white transition-colors hover:text-white/90";

  const rowPad = "px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

  const searchInputClass =
    "h-10 w-full rounded-[6px] border border-white/[0.1] bg-[#0a101a] py-2 pl-10 pr-4 text-[0.78rem] text-slate-200 outline-none transition-colors placeholder:text-slate-400 focus:border-white/[0.18] focus:bg-[#0d1420] sm:pl-11 sm:pr-4";

  const searchIconWrapClass =
    "pointer-events-none absolute left-3.5 top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center sm:left-4";

  return (
    <header className="fixed left-0 right-0 top-0 z-[200] w-full min-w-0">
      <nav className="w-full min-w-0 border-b border-white/[0.06] bg-[#020617] py-3 backdrop-blur-xl">
        <div
          className={`flex w-full min-w-0 items-center gap-4 lg:gap-6 ${rowPad}`}
        >
          {/* Far left: logo only (large empty space before nav — handled by center flex) */}
          <Link
            href="/"
            className="relative z-10 shrink-0 leading-none"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/images/white-Logo.svg"
              alt="BeyondAQI by atovio"
              width={135}
              height={43}
              priority
              unoptimized
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          {/* Nav + search: one cluster, centered in space between logo and theme (screenshot 2) */}
          <div className="hidden min-h-[3rem] min-w-0 flex-1 items-center justify-center md:flex md:px-2 lg:px-4">
            <div className="flex max-w-full items-center gap-7 lg:gap-9 xl:gap-10 2xl:gap-12 lg:translate-x-[2%] xl:translate-x-[3%]">
              <nav className="flex shrink-0 items-center gap-5 lg:gap-6">
                {NAV.map((item) =>
                  item.href.startsWith("#") && item.href !== "#" ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`${navLinkClass} whitespace-nowrap`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToRealtimeMap();
                      }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`${navLinkClass} whitespace-nowrap`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>

              {/* Narrower search ~35–40% feel vs full bar; pill */}
              <div className="relative ml-[3rem] w-[min(20.5rem,40vw)] shrink-0 sm:w-[21.5rem] md:w-[23rem] lg:w-[24.5rem] xl:w-[26.5rem]">
                <span className={searchIconWrapClass} aria-hidden>
                  <Image
                    src="/images/search-icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    unoptimized
                    className="opacity-90"
                  />
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, area, pincode..."
                  className={searchInputClass}
                  aria-label="Search city, area, or pincode"
                  autoComplete="off"
                  enterKeyHint="search"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setThemeHint((t) => (t === "dark" ? "light" : "dark"))
            }
            className="relative z-10 hidden shrink-0 items-center gap-2.5 rounded-full border border-white/[0.12] bg-[#020617] py-2 pl-4 pr-3 text-[0.78rem] font-medium text-slate-200 transition-colors hover:border-white/[0.18] hover:bg-[#0a101a] md:flex"
            aria-label="Toggle color theme"
          >
            <span className="whitespace-nowrap">
              {themeHint === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
            <Image
              src="/images/light-mode.svg"
              alt=""
              width={22}
              height={22}
              unoptimized
              className="shrink-0"
            />
          </button>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0a101a] text-slate-400"
              aria-label="Search city, area, or pincode"
            >
              <Image
                src="/images/search-icon.svg"
                alt=""
                width={18}
                height={18}
                unoptimized
                className="opacity-90"
              />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] text-white"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        <div
          className={`mt-3 flex flex-col gap-3 border-t border-white/[0.06] pt-3 md:hidden ${rowPad} ${
            menuOpen ? "" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-2.5">
            {NAV.map((item) =>
              item.href.startsWith("#") && item.href !== "#" ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${navLinkClass} py-1`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToRealtimeMap();
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${navLinkClass} py-1`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="relative w-full">
            <span className={searchIconWrapClass} aria-hidden>
              <Image
                src="/images/search-icon.svg"
                alt=""
                width={18}
                height={18}
                unoptimized
                className="opacity-90"
              />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, area, pincode..."
              className={searchInputClass}
              aria-label="Search city, area, or pincode"
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setThemeHint((t) => (t === "dark" ? "light" : "dark"))
            }
            className="flex items-center justify-center gap-2.5 rounded-full border border-white/[0.12] py-2.5 text-[0.78rem] font-medium text-slate-200"
          >
            {themeHint === "dark" ? "Light Mode" : "Dark Mode"}
            <Image
              src="/images/light-mode.svg"
              alt=""
              width={22}
              height={22}
              unoptimized
            />
          </button>
        </div>
      </nav>
      <LiveAQITicker rowPad={rowPad} />
    </header>
  );
}
