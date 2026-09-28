import React, { useRef } from "react";
import STUDIOS from "../Constant/Studios";

import disneyLogo from "./../assets/Images/disney.png";
import pixarLogo from "./../assets/Images/pixar.png";
import marvelLogo from "./../assets/Images/marvel.png";
import starwarLogo from "./../assets/Images/starwar.png";
import nationalGLogo from "./../assets/Images/nationalG.png";

import disneyVideo from "./../assets/Videos/disney.mp4";
import pixarVideo from "./../assets/Videos/pixar.mp4";
import marvelVideo from "./../assets/Videos/marvel.mp4";
import starwarVideo from "./../assets/Videos/star-wars.mp4";
import nationalGVideo from "./../assets/Videos/national-geographic.mp4";

const LOGOS = {
  disney: disneyLogo,
  pixar: pixarLogo,
  marvel: marvelLogo,
  starwar: starwarLogo,
  nationalG: nationalGLogo,
};

const VIDEOS = {
  disney: disneyVideo,
  pixar: pixarVideo,
  marvel: marvelVideo,
  "star-wars": starwarVideo,
  "national-geographic": nationalGVideo,
};

function ProductionHouse({ onOpenStudio }) {
  const videoRefs = useRef({});

  const play = (id) => videoRefs.current[id]?.play().catch(() => {});
  const stop = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <section aria-label="Studio collections" className="px-4 pt-12 sm:px-5 md:px-16 md:pt-16">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-white md:mb-5 md:text-xl">
        Explore by studio
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 lg:grid-cols-5">
        {STUDIOS.map((studio) => (
          <button
            key={studio.id}
            type="button"
            onClick={() => onOpenStudio(studio.slug)}
            onMouseEnter={() => play(studio.id)}
            onMouseLeave={() => stop(studio.id)}
            onFocus={() => play(studio.id)}
            onBlur={() => stop(studio.id)}
            aria-label={`Browse ${studio.name} titles`}
            className="group relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900 ring-1 ring-white/10 transition duration-300 ease-out hover:ring-2 hover:ring-sky-400/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <img
              src={LOGOS[studio.logo]}
              alt={studio.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-3 transition-opacity duration-300 group-hover:opacity-0 sm:p-4"
            />
            <video
              ref={(node) => {
                videoRefs.current[studio.id] = node;
              }}
              src={VIDEOS[studio.video]}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default ProductionHouse;
