import React from "react";
import MediaCard from "./MediaCard";
import { GridSkeleton } from "./Skeleton";
import { describeError } from "../services/GlobalApi";

function MediaGrid({ items, status, error, onOpen, onPlay, emptyMessage }) {
  if (status === "loading") return <GridSkeleton />;

  if (status === "error") {
    return (
      <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {describeError(error)}
      </p>
    );
  }

  if (!items.length) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
        {emptyMessage || "Nothing here yet."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {items.map((media) => (
        <MediaCard key={media.key} media={media} fluid onOpen={onOpen} onPlay={onPlay} />
      ))}
    </div>
  );
}

export default MediaGrid;
