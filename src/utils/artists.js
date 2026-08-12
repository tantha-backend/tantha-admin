/**
 * Artist records carry the display name on `stageName`; `artistName` and
 * `name` only appear on some populated shapes, so every read has to try all
 * three.
 */
export const artistName = (artist) => {
  if (!artist) return "";

  if (typeof artist === "string") return "";

  return (
    artist.stageName ||
    artist.artistName ||
    artist.name ||
    artist.userId?.name ||
    ""
  );
};

/**
 * The main artist for a song, across the shapes the API returns it in.
 */
export const songArtistName = (song) =>
  artistName(song?.artistId) ||
  artistName(song?.artist) ||
  song?.artistName ||
  "Unknown Artist";

/**
 * Names of everyone featured on a song.
 */
export const songFeaturedNames = (song) =>
  (song?.featuredArtists || []).map(artistName).filter(Boolean);

/**
 * Full credit line — "Artist A" alone, or "Artist A feat. B, C" when the
 * track is a collaboration.
 */
export const songCredit = (song) => {
  const featured = songFeaturedNames(song);
  const main = songArtistName(song);

  return featured.length ? `${main} feat. ${featured.join(", ")}` : main;
};
