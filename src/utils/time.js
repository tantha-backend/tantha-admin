/**
 * Durations are stored as a whole number of seconds; these turn that into
 * something readable without changing what gets sent back to the API.
 */

/**
 * Seconds as clock time — 259 becomes "4:19", 3805 becomes "1:03:25".
 */
export const formatDuration = (seconds) => {
  const total = Math.floor(Number(seconds));

  if (!Number.isFinite(total) || total <= 0) return "0:00";

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const pad = (value) => String(value).padStart(2, "0");

  return hours
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
};

/**
 * The whole-second value to store, from an audio element's fractional
 * `duration`. Returns "" when the browser could not read it, so callers can
 * treat it as "not detected yet".
 */
export const toDurationSeconds = (seconds) => {
  const total = Number(seconds);

  if (!Number.isFinite(total) || total <= 0) return "";

  return Math.floor(total);
};
