import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import MediaCard from "./MediaCard";
import { RowSkeleton } from "./Skeleton";
import { describeError } from "../services/GlobalApi";
import { normalizeList } from "../utils/media";

function MediaRow({ title, eyebrow, fetcher, onOpen, onPlay, variant = "poster" }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const trackRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setItems([]);

    Promise.resolve()
      .then(fetcher)
      .then((resp) => {
        if (cancelled) return;
        setItems(normalizeList(resp?.data?.results || resp || []));
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`${title} row failed`, err);
        setError(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 4,
    });
  }, []);

  useEffect(() => {
    if (status !== "ready") return undefined;
    const el = trackRef.current;
    if (!el) return undefined;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [status, syncEdges]);

  const scrollBy = (amount) => trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });

  return (
    <section className="px-2 pt-8 md:px-4">
      <div className="flex items-end justify-between gap-4 px-3 md:px-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="truncate text-lg font-bold tracking-tight text-white md:text-xl">
            {title}
          </h2>
        </div>
        {status === "ready" && items.length > 0 ? (
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-700)}
              disabled={edges.start}
              aria-label={`Scroll ${title} left`}
              className="rounded-full border border-white/15 p-1.5 text-white transition hover:border-white/50 hover:bg-white/10 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <HiChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(700)}
              disabled={edges.end}
              aria-label={`Scroll ${title} right`}
              className="rounded-full border border-white/15 p-1.5 text-white transition hover:border-white/50 hover:bg-white/10 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <HiChevronRight />
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        {status === "loading" ? <RowSkeleton variant={variant} /> : null}

        {status === "error" ? (
          <p className="mx-3 rounded-md border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 md:mx-4">
            {describeError(error)}
          </p>
        ) : null}

        {status === "ready" && !items.length ? (
          <p className="mx-3 text-sm text-slate-500 md:mx-4">No titles in this row yet.</p>
        ) : null}

        {status === "ready" && items.length ? (
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto px-3 pb-2 scrollbar-none scroll-smooth md:gap-5 md:px-4"
          >
            {items.map((media) => (
              <MediaCard
                key={media.key}
                media={media}
                variant={variant}
                onOpen={onOpen}
                onPlay={onPlay}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default MediaRow;
