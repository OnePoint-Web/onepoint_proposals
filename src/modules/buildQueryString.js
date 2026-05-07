export const buildQueryString = (query) => {
  return new URLSearchParams(
    Object.entries(query).filter(([_, v]) => v !== "")
  ).toString();
};