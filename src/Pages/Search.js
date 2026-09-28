import React, { useEffect, useMemo, useState } from "react";
import GlobalApi from "../services/GlobalApi";
import MediaGrid from "../Components/MediaGrid";
import Footer from "../Components/Footer";
import { normalizeList, dedupe } from "../utils/media";

const SUGGESTIONS = [
  "Star Wars",
  "Marvel",
  "Pixar",
  "National Geographic",
  "The Mandalorian",
  "Frozen",
  "Toy Story",
  "Black Panther",
];

function Search({ query, onOpen, onPlay, onNavigate }) {
  const [term, setTerm] = useState(query || "");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setTerm(query || "");
  }, [query]);

  useEffect(() => {
    const trimmed = (query || "").trim();
    if (!trimmed) {
      setItems([]);
      setStatus("idle");
      return undefined;
    }

    let cancelled = false;
    setStatus("loading");
    const timer = setTimeout(() => {
      GlobalApi.searchMulti(trimmed)
        .then((resp) => {
          if (cancelled) return;
          setItems(dedupe(normalizeList(resp.data.results || [])));
          setStatus("ready");
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("Search failed", err);
          setStatus("error");
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const submit = (event) => {
    event.preventDefault();
    const trimmed = term.trim();
    onNavigate(trimmed ? `/search?query=${encodeURIComponent(trimmed)}` : "/search");
  };

  const resultLabel = useMemo(() => {
    if (status === "loading") return "Searching…";
    if (status === "ready") return `${items.length} result${items.length === 1 ? "" : "s"}`;
    return null;
  }, [status, items.length]);

  return (
    <div className="px-4 pt-8 sm:px-5 md:px-16 md:pt-12">
      <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">Search</h1>
      <p className="mt-1 text-sm text-slate-400">Find any movie or series in the catalogue.</p>

      <form onSubmit={submit} className="mt-5 max-w-2xl" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search movies and series
        </label>
        <div className="relative">
          <input
            id="search-input"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Try “Star Wars”, “Moana”, “Loki”…"
            autoComplete="off"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-4 pr-24 text-base text-white placeholder:text-slate-500 transition focus:border-sky-400/70 focus:bg-white/10 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-white px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Search
          </button>
        </div>
      </form>

      {status === "idle" ? (
        <section className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Popular searches
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onNavigate(`/search?query=${encodeURIComponent(s)}`)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-400/60 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8">
          {resultLabel ? (
            <p className="mb-4 text-sm text-slate-400">
              {status === "loading" ? resultLabel : `${resultLabel} for “${query}”`}
            </p>
          ) : null}
          <MediaGrid
            items={items}
            status={status === "idle" ? "ready" : status}
            onOpen={onOpen}
            onPlay={onPlay}
            emptyMessage={`Nothing matched “${query}”. Try a different spelling or a broader word.`}
          />
        </section>
      )}

      <Footer />
    </div>
  );
}

export default Search;
