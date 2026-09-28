import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HiCheck,
  HiChevronLeft,
  HiChevronRight,
  HiInformationCircle,
  HiPlay,
  HiPlus,
  HiStar,
} from "react-icons/hi2";
import GlobalApi from "../services/GlobalApi";
import GenresList from "../Constant/GenresList";
import ImageUrls from "../Constant/ImageUrls";
import ImageFallback from "./ImageFallback";
import { HeroSkeleton } from "./Skeleton";
import { useWatchlist } from "../Context/WatchlistContext";
import { describeError } from "../services/GlobalApi";
import { normalizeList } from "../utils/media";

const GENRE_MAP = new Map(GenresList.genere.map((g) => [g.id, g.name]));
const SLIDE_LIMIT = 7;
const DOT_WINDOW = 7;

function HeroSlider({ onOpen, onPlay }) {
  const { has, toggle } = useWatchlist();
  const [slides, setSlides] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    GlobalApi.getTrending()
      .then((resp) => {
        if (cancelled) return;
        setSlides(normalizeList(resp.data.results || []).slice(0, SLIDE_LIMIT));
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Trending request failed", err);
        setError(err);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, track.children.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || status !== "ready") return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (track.clientWidth) setActive(Math.round(track.scrollLeft / track.clientWidth));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [status]);

  const dotItems = useMemo(() => {
    if (!slides.length) return [];
    const span = Math.min(DOT_WINDOW, slides.length);
    const start = Math.max(0, Math.min(active - Math.floor(span / 2), slides.length - span));
    return slides.slice(start, start + span).map((item, offset) => ({
      item,
      index: start + offset,
    }));
  }, [slides, active]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(active - 1);
    }
  };

  if (status === "loading") return <HeroSkeleton />;

  if (status === "error" || !slides.length) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h2 className="text-xl font-semibold text-white">Featured titles are unavailable</h2>
        <p className="mt-2 text-sm text-slate-400">{describeError(error)}</p>
      </section>
    );
  }

  return (
    <section
      className="relative"
      aria-roledescription="carousel"
      aria-label="Trending titles"
      onKeyDown={onKeyDown}
    >
      <div ref={trackRef} className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none">
        {slides.map((item, index) => {
          const inList = has(item);
          return (
            <article
              key={item.key}
              className="relative w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${item.title}`}
            >
              <div className="relative h-[68vh] min-h-[460px] w-full overflow-hidden sm:h-[72vh] md:h-[76vh] md:min-h-[560px]">
                {item.backdrop ? (
                  <img
                    src={ImageUrls.heroUrl(item.backdrop)}
                    alt={item.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <ImageFallback className="absolute inset-0 h-full w-full" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d14] from-5% via-[#0b0d14]/40 via-45% to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-16 sm:px-6 md:px-16 md:pb-24">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-400 sm:text-[11px]">
                    Trending now
                  </p>

                  <h1 className="mt-2 max-w-3xl text-3xl font-black leading-[1.05] text-white drop-shadow-lg sm:text-4xl md:mt-3 md:text-6xl">
                    {item.title}
                  </h1>

                  {item.overview ? (
                    <p className="mt-3 line-clamp-2 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm sm:line-clamp-3 md:mt-4 md:text-base">
                      {item.overview}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-400 sm:text-xs md:mt-4 md:text-sm">
                    {item.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-300">
                        <HiStar className="text-xs" />
                        {item.rating.toFixed(1)}
                      </span>
                    ) : null}
                    {item.year ? <span>{item.year}</span> : null}
                    <span className="rounded border border-white/20 px-1.5 py-px text-[9px] uppercase tracking-wider text-slate-300">
                      {item.mediaLabel}
                    </span>
                    {(item.genreIds || []).slice(0, 3).map((id) =>
                      GENRE_MAP.has(id) ? <span key={id}>{GENRE_MAP.get(id)}</span> : null
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
                    <button
                      type="button"
                      onClick={() => onPlay(item)}
                      className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d14] sm:px-6 sm:py-3 sm:text-sm"
                    >
                      <HiPlay className="text-sm sm:text-base" />
                      Play
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpen(item)}
                      className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:px-6 sm:py-3 sm:text-sm"
                    >
                      <HiInformationCircle className="text-sm sm:text-base" />
                      More info
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      aria-pressed={inList}
                      aria-label={inList ? `Remove ${item.title} from watch list` : `Add ${item.title} to watch list`}
                      className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:py-3 ${
                        inList
                          ? "border-sky-400 bg-sky-500/90"
                          : "border-white/25 hover:border-white/60 hover:bg-white/10"
                      }`}
                    >
                      {inList ? <HiCheck className="text-sm sm:text-base" /> : <HiPlus className="text-sm sm:text-base" />}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => scrollToIndex(active - 1)}
            disabled={active === 0}
            aria-label="Previous title"
            className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-slate-900/70 p-2 text-white backdrop-blur transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-0 md:block"
          >
            <HiChevronLeft className="text-2xl" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(active + 1)}
            disabled={active === slides.length - 1}
            aria-label="Next title"
            className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-slate-900/70 p-2 text-white backdrop-blur transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-0 md:block"
          >
            <HiChevronRight className="text-2xl" />
          </button>

          <div className="absolute bottom-5 left-4 z-20 flex gap-2 sm:left-6 md:bottom-6 md:left-16">
            {dotItems.map(({ item, index }) => (
              <button
                key={item.key}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to ${item.title}`}
                aria-current={index === active}
                className={`h-1 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  index === active ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

export default HeroSlider;
