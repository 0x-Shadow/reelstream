import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiCheck, HiPlay, HiPlus, HiStar, HiXMark } from "react-icons/hi2";
import GlobalApi from "../services/GlobalApi";
import ImageUrls from "../Constant/ImageUrls";
import MediaCard from "./MediaCard";
import ImageFallback from "./ImageFallback";
import { DetailSkeleton } from "./Skeleton";
import { useWatchlist } from "../Context/WatchlistContext";
import { dedupe, normalize, normalizeList } from "../utils/media";
import { formatRuntime, SERIES_STATUS } from "../utils/format";

const FOCUSABLE =
  'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function DetailModal({ media, onClose, onOpen, onPlay }) {
  const { has, toggle } = useWatchlist();
  const [status, setStatus] = useState("loading");
  const [detail, setDetail] = useState(null);
  const [similar, setSimilar] = useState([]);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!media) return undefined;
    let cancelled = false;
    setStatus("loading");
    setDetail(null);
    setSimilar([]);

    GlobalApi.getDetails(media.mediaType, media.id)
      .then((resp) => {
        if (cancelled) return;
        const data = resp.data;
        setDetail(data);
        setSimilar(
          dedupe(normalizeList(data.similar?.results || [], media.mediaType)).slice(0, 12)
        );
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Details request failed", err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [media]);

  useEffect(() => {
    if (!media) return undefined;
    restoreRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
    };
  }, [media, onClose]);

  const similarClick = useCallback(
    (next) => {
      setStatus("loading");
      setDetail(null);
      setSimilar([]);
      onOpen({ ...next });
    },
    [onOpen]
  );

  if (!media) return null;

  const d = detail;
  const inList = has(media);
  const title = d?.title || d?.name || media.title;
  const overview = d?.overview || media.overview || "No synopsis available yet.";
  const backdrop = d?.backdrop_path || media.backdrop;
  const rating = d?.vote_average ?? media.rating;
  const genres = (d?.genres || []).map((g) => g.name);
  const runtime = d?.runtime ? formatRuntime(d.runtime) : null;
  const statusLabel = media.mediaType === "tv" ? SERIES_STATUS[d?.status] : null;
  const episodeRun = d?.episode_run_time?.[0] ? formatRuntime(d.episode_run_time[0]) : null;
  const cast = (d?.credits?.cast || []).slice(0, 8);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} details`}
        className="relative w-full max-w-3xl overflow-hidden rounded-t-2xl bg-[#11151f] shadow-2xl shadow-black sm:rounded-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 z-30 rounded-full bg-slate-950/70 p-2 text-white backdrop-blur transition hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <HiXMark className="text-lg" />
        </button>

        {status === "loading" ? <DetailSkeleton /> : null}

        {status === "error" ? (
          <div className="p-8 text-center">
            <h2 className="text-lg font-semibold text-white">{media.title}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Details are unavailable right now. Close this and try again.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Close
            </button>
          </div>
        ) : null}

        {status === "ready" && d ? (
          <div className="max-h-[88vh] overflow-y-auto overscroll-contain">
            <div className="relative h-52 w-full sm:h-72 md:h-96">
              {backdrop ? (
                <img
                  src={ImageUrls.heroUrl(backdrop)}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <ImageFallback className="absolute inset-0 h-full w-full" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#11151f] via-[#11151f]/70 to-transparent" />
            </div>

            <div className="relative -mt-24 px-5 pb-8 sm:-mt-28 md:px-8">
              <h2 className="text-2xl font-black leading-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                {title}
              </h2>
              {d.tagline ? (
                <p className="mt-1.5 text-sm italic text-slate-400">{d.tagline}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-slate-400 sm:text-sm">
                {rating > 0 ? (
                  <span className="inline-flex items-center gap-1 text-amber-300">
                    <HiStar />
                    {rating.toFixed(1)}
                    {d.vote_count ? <span className="text-slate-500">({d.vote_count})</span> : null}
                  </span>
                ) : null}
                {media.year ? <span>{media.year}</span> : null}
                {runtime ? <span>{runtime}</span> : null}
                {episodeRun ? <span>{episodeRun} / episode</span> : null}
                {statusLabel ? <span>{statusLabel}</span> : null}
                <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
                  {media.mediaLabel}
                </span>
                {genres.map((g) => (
                  <span key={g} className="text-slate-500">
                    {g}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onPlay({ ...normalize(d, media.mediaType), mediaType: media.mediaType })}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11151f]"
                >
                  <HiPlay className="text-base" />
                  Play
                </button>
                <button
                  type="button"
                  onClick={() => toggle({ ...normalize(d, media.mediaType), mediaType: media.mediaType })}
                  aria-pressed={inList}
                  className={`inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    inList
                      ? "bg-sky-500 text-white hover:bg-sky-400"
                      : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
                  }`}
                >
                  {inList ? <HiCheck className="text-base" /> : <HiPlus className="text-base" />}
                  {inList ? "In watch list" : "Add to watch list"}
                </button>
              </div>

              <p className="mt-5 max-w-prose text-sm leading-relaxed text-slate-300">{overview}</p>

              {cast.length ? (
                <section className="mt-7">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Cast
                  </h3>
                  <ul className="mt-3 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {cast.map((person) => (
                      <li key={person.id} className="w-20 shrink-0 text-center">
                        {person.profile_path ? (
                          <img
                            src={ImageUrls.posterUrl(person.profile_path)}
                            alt={person.name}
                            loading="lazy"
                            className="aspect-square w-20 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="flex aspect-square w-20 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-500 ring-1 ring-white/10">
                            {person.name.charAt(0)}
                          </div>
                        )}
                        <p className="mt-2 line-clamp-2 text-[11px] font-medium text-slate-300">
                          {person.name}
                        </p>
                        <p className="line-clamp-1 text-[10px] text-slate-500">{person.character}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {similar.length ? (
                <section className="mt-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    More like this
                  </h3>
                  <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-none md:gap-4">
                    {similar.map((item) => (
                      <MediaCard
                        key={item.key}
                        media={item}
                        onOpen={similarClick}
                        onPlay={onPlay}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DetailModal;
