import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import MobileTabBar from "./Components/MobileTabBar";
import DetailModal from "./Components/DetailModal";
import TrailerModal from "./Components/TrailerModal";
import ErrorBoundary from "./Components/ErrorBoundary";
import ConfigNotice from "./Components/ConfigNotice";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import Browse from "./Pages/Browse";
import Originals from "./Pages/Originals";
import WatchList from "./Pages/WatchList";
import StudioPage from "./Pages/StudioPage";
import { WatchlistProvider } from "./Context/WatchlistContext";
import { isConfigured } from "./services/GlobalApi";
import { useHashRoute, navigate, paramOf } from "./utils/router";
import { getStudio } from "./Constant/Studios";

const APP_NAME = "ReelStream";

const TITLES = {
  "/": "Watch movies and series",
  "/search": "Search",
  "/watchlist": "Watch list",
  "/originals": "Originals",
  "/movies": "Movies",
  "/series": "Series",
};

function titleFor(rawPath) {
  if (TITLES[rawPath]) return `${TITLES[rawPath]} · ${APP_NAME}`;
  if (rawPath.startsWith("/studio/")) {
    const studio = getStudio(paramOf(rawPath, "/studio"));
    return studio ? `${studio.name} · ${APP_NAME}` : `Not found · ${APP_NAME}`;
  }
  return `${APP_NAME}`;
}

const NotFound = ({ onNavigate }) => (
  <div className="px-4 py-24 text-center sm:px-5 md:px-16">
    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">404</p>
    <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">We could not find that page</h1>
    <p className="mt-2 text-sm text-slate-400">
      The link may be broken, or the title may have left the catalogue.
    </p>
    <button
      type="button"
      onClick={() => onNavigate("/")}
      className="mt-6 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
    >
      Back to home
    </button>
  </div>
);

function Shell() {
  const path = useHashRoute();
  const [detail, setDetail] = useState(null);
  const [trailer, setTrailer] = useState(null);

  const go = (to) => navigate(to);
  const openDetail = (media) => setDetail(media);
  const playTrailer = (media) => setTrailer(media);

  const [rawPath, search = ""] = path.split("?");
  const params = new URLSearchParams(search);

  useEffect(() => {
    document.title = titleFor(rawPath);
  }, [rawPath]);

  if (!isConfigured) return <ConfigNotice />;

  let page;
  if (rawPath === "/" || rawPath === "") {
    page = <Home onOpen={openDetail} onPlay={playTrailer} onNavigate={go} />;
  } else if (rawPath === "/search") {
    page = (
      <Search
        query={params.get("query") || ""}
        onOpen={openDetail}
        onPlay={playTrailer}
        onNavigate={go}
      />
    );
  } else if (rawPath === "/watchlist") {
    page = <WatchList onOpen={openDetail} onPlay={playTrailer} onNavigate={go} />;
  } else if (rawPath === "/originals") {
    page = <Originals onOpen={openDetail} onPlay={playTrailer} />;
  } else if (rawPath === "/movies") {
    page = <Browse kind="movie" onOpen={openDetail} onPlay={playTrailer} />;
  } else if (rawPath === "/series") {
    page = <Browse kind="tv" onOpen={openDetail} onPlay={playTrailer} />;
  } else if (rawPath.startsWith("/studio/")) {
    page = (
      <StudioPage
        slug={paramOf(rawPath, "/studio")}
        onOpen={openDetail}
        onPlay={playTrailer}
      />
    );
  } else {
    page = <NotFound onNavigate={go} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0d14] pb-16 scrollbar-slim sm:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900"
      >
        Skip to content
      </a>

      <Header path={rawPath} onNavigate={go} />

      <main id="main-content" aria-live="polite">
        {page}
      </main>

      <MobileTabBar path={rawPath} onNavigate={go} />

      {detail ? (
        <DetailModal
          media={detail}
          onClose={() => setDetail(null)}
          onOpen={openDetail}
          onPlay={playTrailer}
        />
      ) : null}

      {trailer ? <TrailerModal media={trailer} onClose={() => setTrailer(null)} /> : null}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WatchlistProvider>
        <Shell />
      </WatchlistProvider>
    </ErrorBoundary>
  );
}

export default App;
