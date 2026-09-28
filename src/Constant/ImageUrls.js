const TMDB_IMAGE_ROOT = "https://image.tmdb.org/t/p";

const POSTER_BASE_URL = `${TMDB_IMAGE_ROOT}/w500`;
const BACKDROP_BASE_URL = `${TMDB_IMAGE_ROOT}/w780`;
const HERO_BASE_URL = `${TMDB_IMAGE_ROOT}/original`;

const posterUrl = (path) => (path ? `${POSTER_BASE_URL}${path}` : null);
const backdropUrl = (path) => (path ? `${BACKDROP_BASE_URL}${path}` : null);
const heroUrl = (path) => (path ? `${HERO_BASE_URL}${path}` : null);

const imageUrls = {
  posterUrl,
  backdropUrl,
  heroUrl,
};

export default imageUrls;
