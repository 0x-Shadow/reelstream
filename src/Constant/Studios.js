const STUDIO_LOGOS = {
  disney: "disney",
  pixar: "pixar",
  marvel: "marvel",
  "star-wars": "starwar",
  "national-geographic": "nationalG",
};

const STUDIO_VIDEOS = {
  disney: "disney",
  pixar: "pixar",
  marvel: "marvel",
  "star-wars": "star-wars",
  "national-geographic": "national-geographic",
};

export const NETWORKS = {
  disneyPlus: 2739,
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
    logo: STUDIO_LOGOS.disney,
    video: STUDIO_VIDEOS.disney,
    companies: [COMPANIES.waltDisneyAnimation, COMPANIES.waltDisneyPictures],
    networks: [NETWORKS.disneyPlus],
  },
  {
    id: 2,
    slug: "pixar",
    name: "Pixar",
    blurb: "Toy Story, Inside Out, Coco and the rest of the family.",
    logo: STUDIO_LOGOS.pixar,
    video: STUDIO_VIDEOS.pixar,
    companies: [COMPANIES.pixar],
    networks: [],
  },
  {
    id: 3,
    slug: "marvel",
    name: "Marvel",
    blurb: "The MCU, from the first iron suit to the multiverse.",
    logo: STUDIO_LOGOS.marvel,
    video: STUDIO_VIDEOS.marvel,
    companies: [COMPANIES.marvel],
    networks: [],
  },
  {
    id: 4,
    slug: "star-wars",
    name: "Star Wars",
    blurb: "A long time ago in a galaxy far, far away.",
    logo: STUDIO_LOGOS["star-wars"],
    video: STUDIO_VIDEOS["star-wars"],
    companies: [COMPANIES.lucasfilm],
    networks: [NETWORKS.disneyPlus],
  },
  {
    id: 5,
    slug: "national-geographic",
    name: "National Geographic",
    blurb: "Documentaries, wildlife and real-world science.",
    logo: STUDIO_LOGOS["national-geographic"],
    video: STUDIO_VIDEOS["national-geographic"],
    companies: [],
    networks: [NETWORKS.nationalGeographic],
  },
];

export const getStudio = (slug) => STUDIOS.find((s) => s.slug === slug) || null;

export default STUDIOS;
