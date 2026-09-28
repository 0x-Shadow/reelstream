import React, { useEffect, useRef, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import GlobalApi from "../services/GlobalApi";

function TrailerModal({ media, onClose }) {
  const [state, setState] = useState({ status: "loading", key: null, name: "" });
  const closeRef = useRef(null);

  useEffect(() => {
    if (!media) return undefined;
    let cancelled = false;
    setState({ status: "loading", key: null, name: media.title });

    GlobalApi.getDetails(media.mediaType, media.id)
      .then((resp) => {
        if (cancelled) return;
        const trailer = GlobalApi.pickTrailer(resp.data.videos?.results);
        setState({
          status: trailer ? "ready" : "missing",
          key: trailer?.key || null,
          name: trailer?.name || media.title,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Trailer lookup failed", err);
        setState({ status: "error", key: null, name: media.title });
      });

    return () => {
      cancelled = true;
    };
  }, [media]);

  useEffect(() => {
    if (!media) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${media.title} trailer`}
        className="w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
          <p className="min-w-0 truncate text-sm font-semibold text-white">{state.name}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close trailer"
            className="shrink-0 rounded-full p-1.5 text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <HiXMark className="text-xl" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {state.status === "loading" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-slate-400">Loading trailer…</p>
            </div>
          ) : null}

          {state.status === "ready" ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${state.key}?autoplay=1&rel=0&modestbranding=1`}
              title={`${media.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : null}

          {state.status !== "loading" && state.status !== "ready" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-sm text-slate-300">
                {state.status === "missing"
                  ? `No trailer is available for ${media.title}.`
                  : "We could not reach the trailer service."}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Back to browsing
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
