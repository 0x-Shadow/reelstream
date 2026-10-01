// ReelStream collections — neutral catalogue groupings powered by TMDB
// company / network filters. No studio artwork is shipped with the app;
// tiles render as styled text so nothing trademarked is distributed.
export const NETWORKS = {
  flagship: 2739,
  nationalGeographic: 43,
};

export const COMPANIES = {
  pixar: 3,
  waltDisneyPictures: 2,
  waltDisneyAnimation: 521,
  marvel: 420,
  lucasfilm: 1,
};

const STUDIOS = [
  {
    id: 1,
    slug: "disney",
    name: "Disney",
    blurb: "Animation, live action and everything in between.",
    accent: "from-sky-500 to-indigo-600",
    companies: [COMPANIES.waltDisneyAnimation, COMPANIES.waltDisneyPictures],
    networks: [NETWORKS.flagship],
  },
  {
    id: 2,
    slug: "pixar",
    name: "Pixar",
    blurb: "Toy Story, Inside Out, Coco and the rest of the family.",
    accent: "from-amber-500 to-orange-600",
    companies: [COMPANIES.pixar],
    networks: [],
  },
  {
    id: 3,
    slug: "marvel",
    name: "Marvel",
    blurb: "The MCU, from the first iron suit to the multiverse.",
    accent: "from-red-600 to-rose-800",
    companies: [COMPANIES.marvel],
    networks: [],
  },
  {
    id: 4,
    slug: "star-wars",
    name: "Star Wars",
    blurb: "A long time ago in a galaxy far, far away.",
    accent: "from-yellow-400 to-amber-700",
    companies: [COMPANIES.lucasfilm],
    networks: [NETWORKS.flagship],
  },
  {
    id: 5,
    slug: "national-geographic",
    name: "National Geographic",
    blurb: "Documentaries, wildlife and real-world science.",
    accent: "from-emerald-500 to-teal-700",
    companies: [],
    networks: [NETWORKS.nationalGeographic],
  },
];

export const getStudio = (slug) => STUDIOS.find((s) => s.slug === slug) || null;

export default STUDIOS;
