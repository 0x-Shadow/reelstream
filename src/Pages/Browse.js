import React, { useCallback, useEffect, useRef, useState } from "react";
import GlobalApi from "../services/GlobalApi";
import GenresList from "../Constant/GenresList";
import MediaGrid from "../Components/MediaGrid";
import Footer from "../Components/Footer";
import { normalizeList } from "../utils/media";

const MOVIE_SORTS = [
  { id: "popular", label: "Most popular", sort: "popularity.desc" },
  { id: "rating", label: "Top rated", sort: "vote_average.desc" },
  { id: "newest", label: "Newest", sort: "primary_release_date.desc" },
];

const TV_SORTS = [
  { id: "popular", label: "Most popular", sort: "popularity.desc" },
  { id: "rating", label: "Top rated", sort: "vote_average.desc" },
  { id: "newest", label: "Newest", sort: "first_air_date.desc" },
];

function Browse({ kind, onOpen, onPlay }) {
  const isTv = kind === "tv";
  const sorts = isTv ? TV_SORTS : MOVIE_SORTS;
  const fallbackType = isTv ? "tv" : "movie";

  const [genreId, setGenreId] = useState("");
  const [sortId, setSortId] = useState("popular");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);
  const requestRef = useRef(0);

  const sort = sorts.find((s) => s.id === sortId) || sorts[0];

  const run = useCallback(
    (targetPage, mode) => {
      const token = ++requestRef.current;
      const params = {
        with_genres: genreId || undefined,
        sort_by: sort.sort,
        page: targetPage,
      };

      if (mode === "replace") setStatus("loading");
      else setLoadingMore(true);

      const request = isTv ? GlobalApi.getTv(params) : GlobalApi.getMovies(params);

      return request
        .then((resp) => {
          if (token !== requestRef.current) return;
          const batch = normalizeList(resp.data.results || [], fallbackType);
          setItems((prev) => (mode === "replace" ? batch : [...prev, ...batch]));
          setHasMore((resp.data.page || 1) < (resp.data.total_pages || 1));
          setStatus("ready");
        })
        .catch((err) => {
          if (token !== requestRef.current) return;
          console.error("Browse request failed", err);
          if (mode === "replace") setStatus("error");
        })
        .finally(() => {
          if (token === requestRef.current) setLoadingMore(false);
        });
    },
    [isTv, genreId, sort.sort, fallbackType]
  );

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    run(1, "replace");
  }, [run]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || status !== "ready") return;
    const next = page + 1;
    setPage(next);
    run(next, "append");
  }, [loadingMore, hasMore, status, page, run]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || status !== "ready") return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "500px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, status, loadMore]);

  const heading = isTv ? "Series" : "Movies";
  const blurb = isTv
    ? "Every season, from limited series to long-running shows."
    : "The full theatrical catalogue, newest and most-loved first.";

  const chip = (isOn) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
      isOn
        ? "border-sky-400 bg-sky-500 text-white"
        : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white"
    }`;

  return (
    <div className="px-4 pt-8 sm:px-5 md:px-16 md:pt-12">
      <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">{heading}</h1>
      <p className="mt-1 text-sm text-slate-400">{blurb}</p>

      <div className="mt-5 space-y-4">
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Genre
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setGenreId("")}
              className={chip(genreId === "")}
            >
              All
            </button>
            {GenresList.genere.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => setGenreId(String(genre.id))}
                className={chip(genreId === String(genre.id))}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Sort by
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {sorts.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSortId(option.id)}
                className={chip(sortId === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <MediaGrid
          items={items}
          status={status}
          onOpen={onOpen}
          onPlay={onPlay}
          emptyMessage="No titles match those filters."
        />
      </div>

      {status === "ready" && items.length > 0 ? (
        <div ref={sentinelRef} className="flex justify-center py-10">
          {loadingMore ? (
            <p className="text-sm text-slate-500">Loading more…</p>
          ) : hasMore ? (
            <button
              type="button"
              onClick={loadMore}
              className="rounded-md border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Load more
            </button>
          ) : (
            <p className="text-sm text-slate-600">You have reached the end.</p>
          )}
        </div>
      ) : null}

      <Footer />
    </div>
  );
}

export default Browse;
