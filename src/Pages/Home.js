import React from "react";
import GenresList from "../Constant/GenresList";
import GlobalApi from "../services/GlobalApi";
import HeroSlider from "../Components/HeroSlider";
import ProductionHouse from "../Components/ProductionHouse";
import MediaRow from "../Components/MediaRow";
import Footer from "../Components/Footer";

const HOME_GENRES = ["28", "12", "16", "35", "878", "10751"];

function Home({ onOpen, onPlay, onNavigate }) {
  return (
    <>
      <HeroSlider onOpen={onOpen} onPlay={onPlay} />

      <ProductionHouse onOpenStudio={(slug) => onNavigate(`/studio/${slug}`)} />

      <section aria-label="Browse by genre" className="pb-8 pt-4">
        <div className="px-4 pt-10 sm:px-5 md:px-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">
            Browse by genre
          </p>
        </div>

        {HOME_GENRES.map((genreId, index) => {
          const genre = GenresList.genere.find((g) => String(g.id) === genreId);
          if (!genre) return null;
          return (
            <MediaRow
              key={genreId}
              title={genre.name}
              variant={index % 3 === 0 ? "backdrop" : "poster"}
              fetcher={() => GlobalApi.getMovieByGenre(genreId)}
              onOpen={onOpen}
              onPlay={onPlay}
            />
          );
        })}
      </section>

      <MediaRow
        title="Series worth starting"
        eyebrow="Binge-worthy"
        fetcher={() => GlobalApi.getTv({ with_genres: 10765 })}
        onOpen={onOpen}
        onPlay={onPlay}
      />

      <MediaRow
        title="Award winners"
        fetcher={() => GlobalApi.getMovies({ vote_average: { gte: 8 }, vote_count: { gte: 500 } })}
        onOpen={onOpen}
        onPlay={onPlay}
      />

      <Footer />
    </>
  );
}

export default Home;
