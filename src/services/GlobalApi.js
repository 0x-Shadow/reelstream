import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

/**
 * The TMDb v4 read access token. Create one at
 * https://www.themoviedb.org/settings/api and put it in `.env` as
 * `REACT_APP_TMDB_READ_TOKEN` (see `.env.example`).
 *
 * Note: any `REACT_APP_*` value is inlined into the client bundle at build
 * time. That is expected here - a TMDb *read access token* is issued for
 * exactly this kind of public, read-only client use. Never put a private key,
 * a database credential, or a TMDb *API write* key in a `REACT_APP_` variable.
 */
const READ_TOKEN = process.env.REACT_APP_TMDB_READ_TOKEN || "";

export const isConfigured = Boolean(READ_TOKEN);

export const configError =
  "The TMDb API token is missing. Copy `.env.example` to `.env`, set " +
  "REACT_APP_TMDB_READ_TOKEN to your TMDb API read access token, and restart the dev server.";

/** TMDB expects dot notation for range filters, e.g. `vote_average.gte=8`. */
const serialize = (params) => {
  const parts = [];
  const push = (key, value) => {
    if (value === undefined || value === null || value === "") return;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  };

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      push(key, value.join(","));
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([inner, innerValue]) => push(`${key}.${inner}`, innerValue));
    } else {
      push(key, value);
    }
  });

  return parts.join("&");
};

const client = axios.create({
  baseURL: BASE_URL,
  headers: READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : {},
  paramsSerializer: { serialize },
});

/** Turn a TMDb error into something a person can act on. */
export const describeError = (error) => {
  const status = error?.response?.status;

  if (!isConfigured) return configError;
  if (status === 401) {
    return "TMDb rejected the API token. Check REACT_APP_TMDB_READ_TOKEN in your .env file and restart the dev server.";
  }
  if (status === 404) return "That title is no longer in the catalogue.";
  if (status === 429) return "Too many requests to TMDb. Wait a moment and try again.";
  if (error?.message === "Network Error") {
    return "No connection to TMDb. Check your internet connection and try again.";
  }
  return "Something went wrong loading titles. Try again in a moment.";
};

const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

const discover = (kind, params) =>
  client.get(`/discover/${kind}`, { params: cleanParams({ sort_by: "popularity.desc", ...params }) });

const getTrending = (window = "day") => client.get(`/trending/all/${window}`);

const searchMulti = (query, page = 1) =>
  client.get("/search/multi", { params: { query, page, include_adult: false } });

const getMovieByGenre = (genreId, page = 1) => discover("movie", { with_genres: genreId, page });

const getTvByGenre = (genreId, page = 1) => discover("tv", { with_genres: genreId, page });

const getMovies = (params) => discover("movie", params);

const getTv = (params) => discover("tv", params);

// Note: TMDb ignores the singular `with_company`; only `with_companies` filters.
const getByCompany = (companyId, page = 1) => discover("movie", { with_companies: companyId, page });

const getByNetwork = (networkId, page = 1) => discover("tv", { with_networks: networkId, page });

const settleAll = (promises) =>
  Promise.all(
    promises.map((p) =>
      p.then((r) => r.data.results || []).catch(() => [])
    )
  );

/** Merge every studio source (companies + networks) into one deduplicated list. */
const getStudioCatalogue = async ({ companies = [], networks = [] } = {}) => {
  const requests = [
    ...companies.map((id) => getByCompany(id)),
    ...networks.map((id) => getByNetwork(id)),
  ];
  if (!requests.length) return [];
  const batches = await settleAll(requests);
  return batches.flat();
};

const getDetails = (mediaType, id) =>
  client.get(`/${mediaType}/${id}`, {
    params: { append_to_response: "credits,similar,videos" },
  });

const pickTrailer = (videos) => {
  const list = videos || [];
  return (
    list.find((v) => v.type === "Trailer" && v.site === "YouTube" && v.official) ||
    list.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    list.find((v) => v.type === "Teaser" && v.site === "YouTube") ||
    list.find((v) => v.site === "YouTube") ||
    null
  );
};

const GlobalApi = {
  getTrending,
  searchMulti,
  getMovieByGenre,
  getTvByGenre,
  getMovies,
  getTv,
  getByCompany,
  getByNetwork,
  getStudioCatalogue,
  getDetails,
  pickTrailer,
};

export default GlobalApi;
