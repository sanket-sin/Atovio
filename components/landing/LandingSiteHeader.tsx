"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  fetchCityAqiBySlug,
  normalizeBeyondAqiSlug,
  searchResultToHeroSnapshot,
  type HeroCitySnapshot,
} from "@/lib/api/aqi-city";
import {
  isFetchableCitySearchResult,
  resolveSearchResultSlug,
  searchAqi,
  type AqiSearchResult,
} from "@/lib/api/aqi-search";
import { aqiLevelToTextClass, getAqiLevel } from "@/lib/air-quality/aqi-levels";
import { LiveAQITicker } from "./LiveAQITicker";

const NAV = [
  { href: "#sec-realtime-map", label: "Sensor Map" },
  { href: "/blog", label: "Blog" },
  { href: "#", label: "API" },
  { href: "#", label: "About" },
];

function scrollToRealtimeMap() {
  /** Off the landing page there is no map section to reach, so go home and land on it. */
  if (!document.getElementById("sec-realtime-map")) {
    window.location.href = "/#sec-realtime-map";
    return;
  }

  document
    .getElementById("sec-realtime-map")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AqiChip({ aqi }: { aqi?: number }) {
  if (aqi == null) return null;
  const color = aqiLevelToTextClass(getAqiLevel(aqi).variant);
  return (
    <span className={`font-sans text-[0.75rem] font-bold ${color}`}>
      {aqi}
    </span>
  );
}

export function LandingSiteHeader({
  isLight,
  onToggleTheme,
  onCityDataLoaded,
}: {
  isLight: boolean;
  onToggleTheme: () => void;
  onCityDataLoaded?: (snapshot: HeroCitySnapshot) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<AqiSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityFetchLoading, setCityFetchLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 500);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** After picking a dropdown row we set the input to the row label; skip `/api/aqi/search` for that fill until the user edits the query (otherwise every selection retriggers search instead of only GET `/api/aqi/India/…`). */
  const frozenSearchLabelRef = useRef<string | null>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      frozenSearchLabelRef.current = null;
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    if (
      frozenSearchLabelRef.current !== null &&
      debouncedQuery === frozenSearchLabelRef.current
    ) {
      setLoading(false);
      return;
    }

    if (
      frozenSearchLabelRef.current !== null &&
      debouncedQuery !== frozenSearchLabelRef.current
    ) {
      frozenSearchLabelRef.current = null;
    }

    let cancelled = false;
    setLoading(true);
    searchAqi(debouncedQuery)
      .then((data) => {
        if (!cancelled) {
          setResults(data);
          setDropdownOpen(true);
        }
      })
      .catch((err: unknown) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[BeyondAQI search] request failed:", err);
        }
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleResultClick(result: AqiSearchResult) {
    const label = result.city ?? result.name;
    frozenSearchLabelRef.current = label;
    setSearchQuery(label);
    setDropdownOpen(false);

    if (!isFetchableCitySearchResult(result)) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[BeyondAQI] search row lacks country/city path:", result);
      }
      onCityDataLoaded?.(searchResultToHeroSnapshot(result));
      return;
    }

    const slug = resolveSearchResultSlug(result)!;
    const normalizedSlug = normalizeBeyondAqiSlug(slug);

    setCityFetchLoading(true);
    try {
      const snapshot = await fetchCityAqiBySlug(normalizedSlug);
      onCityDataLoaded?.(snapshot);
    } catch (err: unknown) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[BeyondAQI] city AQI GET failed; using search snapshot:", {
          slug: normalizedSlug,
          err,
        });
      }
      onCityDataLoaded?.(searchResultToHeroSnapshot(result));
    } finally {
      setCityFetchLoading(false);
    }
  }

  const navLinkClass = `text-sm font-medium transition-colors ${isLight ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-white/90"}`;
  const rowPad = "px-4 sm:px-6 lg:px-8 xl:px-10";
  const hasSearchValue = searchQuery.length > 0;
  const searchInputPadRight = hasSearchValue ? "pr-10 sm:pr-10" : "pr-4 sm:pr-4";
  const searchInputClass = isLight
    ? `h-10 w-full rounded-[6px] border border-gray-300 bg-gray-100 py-2 pl-10 text-[0.78rem] text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-bqa-accent focus:bg-white sm:pl-11 ${searchInputPadRight}`
    : `h-10 w-full rounded-[6px] border border-white/[0.1] bg-[#0a101a] py-2 pl-10 text-[0.78rem] text-slate-200 outline-none transition-colors placeholder:text-slate-400 focus:border-white/[0.18] focus:bg-[#0d1420] sm:pl-11 ${searchInputPadRight}`;

  function clearSearch() {
    frozenSearchLabelRef.current = null;
    setSearchQuery("");
    setResults([]);
    setDropdownOpen(false);
    inputRef.current?.focus();
  }
  const searchPlaceholder =
    "Search city…";
  const searchIconWrapClass =
    "pointer-events-none absolute left-3.5 top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center sm:left-4";

  const SearchDropdown = () =>
    dropdownOpen && (results.length > 0 || loading || cityFetchLoading) ? (
      <div
        ref={dropdownRef}
        className={`search-dropdown absolute left-0 top-full z-[300] mt-1.5 w-full overflow-hidden rounded-[10px] border shadow-[0_16px_48px_rgba(0,0,0,0.6)] ${isLight ? "border-gray-200 bg-white" : "border-white/[0.08] bg-[#0a101a]"}`}
      >
        {(loading || cityFetchLoading) && results.length === 0 ? (
          <div className={`flex items-center justify-center gap-2 px-4 py-3 text-[0.78rem] ${isLight ? "text-gray-500" : "text-slate-400"}`}>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-bqa-accent" />
            Searching…
          </div>
        ) : (
          <ul>
            {/* The API can return the same slug/url twice (e.g. a city and one of its
                stations), so the index keeps each key unique. */}
            {results.map((r, i) => (
              <li key={`${r.slug ?? r.url ?? r.name}-${i}`}>
                <button
                  type="button"
                  onClick={() => handleResultClick(r)}
                  className={`search-dropdown-item flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${isLight ? "hover:bg-blue-50" : "hover:bg-white/[0.05]"}`}
                >
                  <div className="min-w-0">
                    <div className={`search-dropdown-text truncate text-[0.82rem] font-medium ${isLight ? "text-gray-900" : "text-slate-200"}`}>
                      {r.name ?? r.city}
                    </div>
                    {(r.state || r.country) && (
                      <div className={`search-dropdown-sub truncate text-[0.7rem] ${isLight ? "text-gray-500" : "text-slate-500"}`}>
                        {[r.state, r.country].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                  <AqiChip aqi={r.aqi} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {!loading && results.length === 0 && debouncedQuery.trim() && (
          <div className={`px-4 py-3 text-[0.78rem] ${isLight ? "text-gray-400" : "text-slate-500"}`}>
            No results for &quot;{debouncedQuery}&quot;
          </div>
        )}
      </div>
    ) : null;

  return (
    <header className="fixed left-0 right-0 top-0 z-[200] w-full min-w-0">
      <nav className={`relative z-[10] w-full min-w-0 border-b py-3 backdrop-blur-xl transition-colors ${isLight ? "border-black/[0.07] bg-white/97" : "border-white/[0.06] bg-[#020617]"}`}>
        <div
          className={`flex w-full min-w-0 items-center gap-4 lg:gap-6 ${rowPad}`}
        >
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
              className="site-logo h-7 w-auto sm:h-9 md:h-9"
            />
          </Link>

          {/* Single search + desktop nav (one input for ref / dropdown) */}
          <div className="flex min-h-[2.5rem] min-w-0 flex-1 items-center gap-3 md:min-h-[3rem] md:justify-center md:px-2 lg:px-4">
            <div className="flex max-w-full flex-1 items-center gap-5 md:gap-7 lg:gap-9 xl:gap-10 2xl:gap-12 lg:translate-x-[2%] xl:translate-x-[3%]">
              <nav className="hidden shrink-0 items-center gap-5 md:flex lg:gap-6">
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

              <div className="relative min-w-0 flex-1 md:ml-[3rem] md:w-[min(20.5rem,40vw)] md:flex-none md:shrink-0 lg:w-[24.5rem] xl:w-[26.5rem]">
                <span className={searchIconWrapClass} aria-hidden>
                  {loading || cityFetchLoading ? (
                    <span className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/20 border-t-bqa-accent" />
                  ) : (
                    <Image
                      src="/images/search-icon.svg"
                      alt=""
                      width={18}
                      height={18}
                      unoptimized
                      className={
                        isLight ? "opacity-90 brightness-0" : "opacity-90"
                      }
                    />
                  )}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (
                      frozenSearchLabelRef.current !== null &&
                      v !== frozenSearchLabelRef.current
                    ) {
                      frozenSearchLabelRef.current = null;
                    }
                    setSearchQuery(v);
                  }}
                  onFocus={() => results.length > 0 && setDropdownOpen(true)}
                  onKeyDown={(e) => e.key === "Escape" && setDropdownOpen(false)}
                  placeholder={searchPlaceholder}
                  className={searchInputClass}
                  aria-label="Search city, area, or pincode"
                  autoComplete="off"
                  enterKeyHint="search"
                />
                {hasSearchValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-bqa-accent transition-colors hover:text-bqa-accent2 sm:right-3.5"
                    aria-label="Clear search"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M3 3L11 11"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M11 3L3 11"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
                <SearchDropdown />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={`relative z-10 hidden shrink-0 items-center gap-2.5 rounded-full border py-2 pl-4 pr-3 text-[0.78rem] font-medium transition-colors md:flex ${isLight ? "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200" : "border-white/[0.12] bg-[#020617] text-slate-200 hover:border-white/[0.18] hover:bg-[#0a101a]"}`}
            aria-label="Toggle color theme"
          >
            <span className="whitespace-nowrap">
              {isLight ? "Dark Mode" : "Light Mode"}
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

          <div className="ml-auto flex shrink-0 items-center md:hidden">
            <button
              type="button"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${isLight ? "border-gray-300 text-gray-700" : "border-white/[0.1] text-white"}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        <div
          className={`mt-3 flex flex-col gap-3 border-t pt-3 md:hidden ${rowPad} ${isLight ? "border-gray-200" : "border-white/[0.06]"} ${menuOpen ? "" : "hidden"}`}
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

          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center justify-center gap-2.5 rounded-full border py-2.5 text-[0.78rem] font-medium ${isLight ? "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200" : "border-white/[0.12] text-slate-200 hover:bg-white/[0.05]"}`}
          >
            {isLight ? "Dark Mode" : "Light Mode"}
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
      <LiveAQITicker rowPad={rowPad} isLight={isLight} />
    </header>
  );
}
