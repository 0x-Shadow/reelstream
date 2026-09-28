import React from "react";
import { HiFilm } from "react-icons/hi2";

function ImageFallback({ label = "Artwork unavailable", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500 ${className}`}
    >
      <HiFilm className="text-2xl" />
      <span className="px-2 text-center text-[10px] uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export default ImageFallback;
