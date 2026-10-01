import React from "react";
import STUDIOS from "../Constant/Studios";

function ProductionHouse({ onOpenStudio }) {
  return (
    <section aria-label="Collections" className="px-4 pt-12 sm:px-5 md:px-16 md:pt-16">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-white md:mb-5 md:text-xl">
        Explore collections
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 lg:grid-cols-5">
        {STUDIOS.map((studio) => (
          <button
            key={studio.id}
            type="button"
            onClick={() => onOpenStudio(studio.slug)}
            aria-label={`Browse ${studio.name} titles`}
            title={studio.blurb}
            className={`group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${studio.accent} ring-1 ring-white/10 transition duration-300 ease-out hover:ring-2 hover:ring-sky-400/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`}
          >
            <span
              aria-hidden="true"
              className="text-4xl font-black tracking-tight text-white/90 drop-shadow md:text-5xl"
            >
              {studio.name.charAt(0)}
            </span>
            <span className="mt-1 px-2 text-center text-xs font-bold text-white md:text-sm">
              {studio.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ProductionHouse;
