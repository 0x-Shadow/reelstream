import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./services/GlobalApi", () => ({
  __esModule: true,
  default: {
    getTrending: jest.fn(() => new Promise(() => {})),
    getMovieByGenre: jest.fn(() => new Promise(() => {})),
    getTv: jest.fn(() => new Promise(() => {})),
    getMovies: jest.fn(() => new Promise(() => {})),
    getByCompany: jest.fn(() => new Promise(() => {})),
    getByNetwork: jest.fn(() => new Promise(() => {})),
    getStudioCatalogue: jest.fn(() => Promise.resolve([])),
    getDetails: jest.fn(() => new Promise(() => {})),
    pickTrailer: jest.fn(() => null),
  },
}));

test("renders the primary navigation and the home page heading", () => {
  render(<App />);
  expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1, name: /runner|trending/i })).toBeTruthy();
});
