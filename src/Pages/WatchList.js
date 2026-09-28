import React from "react";
import { useWatchlist } from "../Context/WatchlistContext";
import MediaCard from "../Components/MediaCard";
import Footer from "../Components/Footer";

function WatchList({ onOpen, onPlay, onNavigate }) {
  const { items, clear, count } = useWatchlist();

  return (
    <div className="px-4 pt-8 sm:px-5 md:px-16 md:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">
            Saved for later
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
            Watch list
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {count
              ? `${count} title${count === 1 ? "" : "s"} saved on this device.`
              : "Nothing saved yet."}
          </p>
        </div>

        {count > 0 ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Remove every title from your watch list?")) clear();
            }}
            className="rounded-md border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {count > 0 ? (
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {items.map((media) => (
            <MediaCard key={media.key} media={media} fluid onOpen={onOpen} onPlay={onPlay} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-white">Your watch list is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Tap the plus icon on any poster to save it here. Your list stays on this device, so
            you can pick it back up on any visit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="rounded-md bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Browse titles
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/search")}
              className="rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Search instead
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default WatchList;
