import React, { useEffect, useState } from "react";
import GlobalApi from "../services/GlobalApi";
import { getStudio } from "../Constant/Studios";
import MediaGrid from "../Components/MediaGrid";
import Footer from "../Components/Footer";
import { dedupe, normalizeList } from "../utils/media";

function StudioPage({ slug, onOpen, onPlay }) {
  const studio = getStudio(slug);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!studio) return undefined;
    let cancelled = false;
    setStatus("loading");
    setItems([]);

    GlobalApi.getStudioCatalogue({
      companies: studio.companies || [],
      networks: studio.networks || [],
    })
      .then((results) => {
        if (cancelled) return;
        setItems(dedupe(normalizeList(results)));
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Studio request failed", err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [studio]);

  if (!studio) {
    return (
      <div className="px-4 py-24 text-center sm:px-5 md:px-16">
        <h1 className="text-2xl font-black text-white">Collection not found</h1>
        <p className="mt-2 text-sm text-slate-400">That collection does not exist.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 sm:px-5 md:px-16 md:pt-12">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">Collection</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-4xl">
        {studio.name}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">{studio.blurb}</p>

      <div className="mt-8">
        <MediaGrid
          items={items}
          status={status}
          onOpen={onOpen}
          onPlay={onPlay}
          emptyMessage={`No ${studio.name} titles came back from the catalogue.`}
        />
      </div>

      <Footer />
    </div>
  );
}

export default StudioPage;
