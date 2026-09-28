export const formatRuntime = (minutes) => {
  if (!minutes || minutes < 1) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m`;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatCount = (value) => {
  if (!value) return null;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
};

export const formatYear = (date) => (date ? String(date).slice(0, 4) : null);

export const SERIES_STATUS = {
  0: "Returning series",
  1: "Continuing",
  2: "In production",
  3: "Ended",
  4: "Cancelled",
  5: "Planned",
};
