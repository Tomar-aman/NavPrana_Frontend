export const encodeId = (id) => {
  return btoa(id.toString());
};

export const decodeId = (encoded) => {
  try {
    return Number(atob(encoded));
  } catch {
    return null;
  }
};
