import { useEffect, useState } from "react";

const currentPath = () => {
  const raw = window.location.hash.replace(/^#/, "");
  return raw || "/";
};

export function useHashRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onChange = () => {
      setPath(currentPath());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return path;
}

export const navigate = (to) => {
  const next = to.startsWith("/") ? to : `/${to}`;
  if (currentPath() === next) return;
  window.location.hash = next;
};

export const matchSegment = (path, prefix) =>
  path === prefix || path.startsWith(`${prefix}/`);

export const paramOf = (path, prefix) =>
  path.startsWith(`${prefix}/`) ? decodeURIComponent(path.slice(prefix.length + 1)) : null;
