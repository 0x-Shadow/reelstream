import React from "react";
import { HiCheck, HiPlay, HiPlus, HiStar } from "react-icons/hi2";
import ImageUrls from "../Constant/ImageUrls";
import ImageFallback from "./ImageFallback";
import { useWatchlist } from "../Context/WatchlistContext";
import { formatCount } from "../utils/format";

function MediaCard({ media, variant = "poster", onOpen, onPlay, fluid = false, className = "" }) {
  const { has, toggle } = useWatchlist();
  const inList = has(media);
  const isBackdrop = variant === "backdrop";

  const stop = (event) => event.stopPropagation();

  const width = fluid
    ? "w-full"
    : isBackdrop
      ? "w-44 sm:w-64 md:w-80"
      : "w-28 sm:w-36 md:w-44";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(media)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(media);
        }
      }}
      aria-label={`${media.title} details`}
      className={`group shrink-0 cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d14] ${width} ${className}`}
    >
      <div
        className={`relative overflow-hidden rounded-lg bg-slate-900 shadow-lg shadow-black/60 ring-1 ring-white/5 transition duration-200 ease-out group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-sky-400/80 group-focus-visible:ring-2 ${
          isBackdrop ? "aspect-video" : "aspect-[2/3]"
        }`}
      >
        {isBackdrop ? (
          media.backdrop ? (
            <img
              src={ImageUrls.backdropUrl(media.backdrop)}
              alt={media.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <ImageFallback className="h-full w-full" />
          )
        ) : media.poster ? (
          <img
            src={ImageUrls.posterUrl(media.poster)}
            alt={media.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <ImageFallback className="h-full w-full" />
        )}

        {media.rating > 0 ? (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur">
            <HiStar className="text-[9px]" />
            {media.rating.toFixed(1)}
            {media.voteCount > 0 ? (
              <span className="font-normal text-slate-400">({formatCount(media.voteCount)})</span>
            ) : null}
          </span>
        ) : null}

        <span className="absolute right-1.5 top-1.5 rounded bg-slate-950/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-300 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
          {media.mediaLabel}
        </span>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent px-2 pb-2 pt-8 transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                onPlay(media);
              }}
              aria-label={`Play trailer for ${media.title}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <HiPlay className="text-sm translate-x-px" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                toggle(media);
              }}
              aria-pressed={inList}
              aria-label={inList ? `Remove ${media.title} from watch list` : `Add ${media.title} to watch list`}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                inList
                  ? "bg-sky-500 text-white hover:bg-sky-400"
                  : "bg-white/20 text-white backdrop-blur hover:bg-white/35"
              }`}
            >
              {inList ? <HiCheck /> : <HiPlus />}
            </button>
          </div>
        </div>
      </div>

      <h3 className="mt-2 line-clamp-1 text-xs font-semibold text-slate-200 transition group-hover:text-white sm:text-sm">
        {media.title}
      </h3>
      {media.year ? <p className="mt-0.5 text-[11px] text-slate-500">{media.year}</p> : null}
    </article>
  );
}

export default MediaCard;
