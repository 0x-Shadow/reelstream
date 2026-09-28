import React, { useEffect, useRef, useState } from "react";
import logo from "./../assets/Images/logo.png";
import {
  HiBars3,
  HiHome,
  HiMagnifyingGlass,
  HiPlayCircle,
  HiPlus,
  HiStar,
  HiTv,
  HiXMark,
} from "react-icons/hi2";
import HeaderItem from "./HeaderItem";
import { useWatchlist } from "../Context/WatchlistContext";

export const NAV = [
  { name: "Home", short: "Home", path: "/", icon: HiHome },
  { name: "Search", short: "Search", path: "/search", icon: HiMagnifyingGlass },
  { name: "Watch list", short: "List", path: "/watchlist", icon: HiPlus },
  { name: "Originals", short: "Originals", path: "/originals", icon: HiStar },
  { name: "Movies", short: "Movies", path: "/movies", icon: HiPlayCircle },
  { name: "Series", short: "Series", path: "/series", icon: HiTv },
];

function Header({ path, onNavigate }) {
  const { count } = useWatchlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (target) =>
    target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`);

  const go = (target) => {
    onNavigate(target);
    setMenuOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    onNavigate(trimmed ? `/search?query=${encodeURIComponent(trimmed)}` : "/search");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0b0d14]/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-4 sm:px-5 md:h-20 md:gap-10 md:px-16">
        <button
          type="button"
          onClick={() => go("/")}
          aria-label="Disney+ Hotstar home"
          className="shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <img src={logo} alt="Disney+ Hotstar" className="h-6 w-auto md:h-9" />
        </button>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV.map((item) => (
            <HeaderItem
              key={item.name}
              name={item.name}
              Icon={item.icon}
              active={isActive(item.path)}
              badge={item.name === "Watch list" && count > 0 ? count : null}
              onClick={() => go(item.path)}
            />
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 md:block" role="search">
          <label htmlFor="header-search" className="sr-only">
            Search titles
          </label>
          <div className="relative">
            <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="header-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies and series"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 transition focus:border-sky-400/70 focus:bg-white/10 focus:outline-none"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <button
            type="button"
            onClick={() => go("/search")}
            aria-label="Search"
            className="rounded-md p-2 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 md:hidden"
          >
            <HiMagnifyingGlass className="text-xl" />
          </button>
          <button
            type="button"
            onClick={() => go("/watchlist")}
            aria-label={`Watch list, ${count} saved`}
            className="relative rounded-md p-2 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 md:hidden"
          >
            <HiPlus className="text-xl" />
            {count > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => go("/watchlist")}
            aria-label={`Watch list, ${count} saved`}
            className="hidden shrink-0 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-xs font-bold text-white ring-2 ring-white/10 transition hover:ring-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 md:flex md:h-8 md:w-8 md:items-center md:justify-center"
          >
            {count > 0 ? count : "N"}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 lg:hidden"
          >
            {menuOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          ref={panelRef}
          aria-label="Primary mobile"
          className="border-t border-white/5 bg-[#0b0d14] px-4 py-4 sm:px-5 lg:hidden"
        >
          <form onSubmit={submitSearch} className="mb-3 md:hidden" role="search">
            <label htmlFor="mobile-search" className="sr-only">
              Search titles
            </label>
            <div className="relative">
              <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="mobile-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies and series"
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none"
              />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
            {NAV.map((item) => (
              <HeaderItem
                key={item.name}
                name={item.name}
                Icon={item.icon}
                active={isActive(item.path)}
                badge={item.name === "Watch list" && count > 0 ? count : null}
                onClick={() => go(item.path)}
              />
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export default Header;
