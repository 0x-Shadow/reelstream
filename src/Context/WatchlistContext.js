import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { keyOf, normalize } from "../utils/media";

const STORAGE_KEY = "dplus:watchlist:v1";

const WatchlistContext = createContext(null);

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((m) => m && m.id && m.mediaType) : [];
  } catch {
    return [];
  }
};

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked - the list still works for this session */
    }
  }, [items]);

  const keys = useMemo(() => new Set(items.map((m) => keyOf(m.mediaType, m.id))), [items]);

  const has = useCallback((media) => keys.has(keyOf(media.mediaType, media.id)), [keys]);

  const add = useCallback((media) => {
    setItems((prev) =>
      prev.some((m) => keyOf(m.mediaType, m.id) === keyOf(media.mediaType, media.id))
        ? prev
        : [normalize(media), ...prev]
    );
  }, []);

  const remove = useCallback((media) => {
    setItems((prev) => prev.filter((m) => keyOf(m.mediaType, m.id) !== keyOf(media.mediaType, media.id)));
  }, []);

  const toggle = useCallback((media) => {
    setItems((prev) => {
      const target = keyOf(media.mediaType, media.id);
      const exists = prev.some((m) => keyOf(m.mediaType, m.id) === target);
      if (exists) return prev.filter((m) => keyOf(m.mediaType, m.id) !== target);
      return [normalize(media), ...prev];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, has, add, remove, toggle, clear, count: items.length }),
    [items, has, add, remove, toggle, clear]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}

export default WatchlistContext;
