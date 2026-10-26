// Builds an optimised Unsplash URL from a photo id.
export const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`
