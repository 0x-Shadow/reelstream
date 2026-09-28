export const normalize = (raw, fallbackType) => {
  const mediaType = raw.media_type || fallbackType || (raw.title ? "movie" : "tv");

  return {
    id: raw.id,
    mediaType,
    key: `${mediaType}:${raw.id}`,
    title: raw.title || raw.name || "Untitled",
    originalTitle: raw.original_title || raw.original_name || raw.title || raw.name || "",
    overview: raw.overview || "",
    tagline: raw.tagline || "",
    poster: raw.poster_path || null,
    backdrop: raw.backdrop_path || raw.poster_path || null,
    rating: Number(raw.vote_average) || 0,
    voteCount: raw.vote_count || 0,
    year: (raw.release_date || raw.first_air_date || "").slice(0, 4) || null,
    releaseDate: raw.release_date || raw.first_air_date || null,
    genreIds: raw.genre_ids || (raw.genres || []).map((g) => g.id),
    popularity: raw.popularity || 0,
    mediaLabel: mediaType === "tv" ? "Series" : "Movie",
  };
};

export const normalizeList = (list, fallbackType) =>
  (list || [])
    .map((raw) => normalize(raw, fallbackType))
    .filter((m) => m.poster || m.backdrop);

export const dedupe = (list) => {
  const seen = new Set();
  return list.filter((m) => {
    if (seen.has(m.key)) return false;
    seen.add(m.key);
    return true;
  });
};

export const keyOf = (mediaType, id) => `${mediaType}:${id}`;
