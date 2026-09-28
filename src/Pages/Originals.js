import React, { useEffect, useMemo, useState } from "react";
import GlobalApi from "../services/GlobalApi";
import { COMPANIES, NETWORKS } from "../Constant/Studios";
import MediaGrid from "../Components/MediaGrid";
import MediaRow from "../Components/MediaRow";
import Footer from "../Components/Footer";
import { dedupe, normalizeList } from "../utils/media";

const SOURCES = [
  { id: "disney-plus", label: "Disney+ series", networks: [NETWORKS.disneyPlus] },
  { id: "marvel", label: "Marvel films", companies: [COMPANIES.marvel] },
  { id: "star-wars", label: "Star Wars", companies: [COMPANIES.lucasfilm] },
  { id: "pixar", label: "Pixar", companies: [COMPANIES.pixar] },
];

function Originals({ onOpen, onPlay }) {
  const [active, setActive] = useState("disney-plus");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  const source = useMemo(
    () => SOURCES.find((s) => s.id === active) || SOURCES[0],
    [active]
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setItems([]);

    GlobalApi.getStudioCatalogue({
      companies: source.companies || [],
      networks: source.networks || [],
    })
      .then((results) => {
        if (cancelled) return;
        setItems(dedupe(normalizeList(results)));
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Originals request failed", err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <div className="pt-8 md:pt-12">
      <div className="px-4 sm:px-5 md:px-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">
          Disney exclusives
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
          Originals
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Titles that belong to the house — pick a collection to narrow it down.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {SOURCES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setActive(option.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                active === option.id
                  ? "border-sky-400 bg-sky-500 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-8 sm:px-5 md:px-16">
        <MediaGrid
          items={items}
          status={status}
          onOpen={onOpen}
          onPlay={onPlay}
          emptyMessage="This collection is empty right now."
        />
      </div>

      <div className="mt-10">
        <MediaRow
          title="Also trending in series"
          fetcher={() => GlobalApi.getTv({ with_networks: NETWORKS.disneyPlus })}
          onOpen={onOpen}
          onPlay={onPlay}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Originals;
