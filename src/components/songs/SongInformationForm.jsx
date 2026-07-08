import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import artistService from "../../services/artistService";
import albumService from "../../services/albumService";

const genres = [
  "Pop",
  "Rock",
  "Hip Hop",
  "Rap",
  "EDM",
  "Electronic",
  "Classical",
  "Folk",
  "Country",
  "Jazz",
  "R&B",
  "Devotional",
  "Indie",
  "Metal",
  "Alternative",
  "Soundtrack",
  "Traditional",
  "Others",
];

const languages = [
  "Manipuri",
  "English",
  "Hindi",
  "Assamese",
  "Bengali",
  "Nepali",
  "Mizo",
  "Nagamese",
  "Khasi",
  "Garo",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Punjabi",
  "Others",
];

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-black px-4 py-3 text-white outline-none transition ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-zinc-800 focus:border-pink-500"
  }`;

const ErrorText = ({ message }) => {
  if (!message) return null;

  return <p className="mt-2 text-xs text-red-400">{message}</p>;
};

const SongInformationForm = ({
  formData,
  setFormData,
  errors = {},
  clearError,
}) => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  useEffect(() => {
    loadArtists();
    loadAlbums();
  }, []);

  const loadArtists = async () => {
    try {
      setLoadingArtists(true);
      const res = await artistService.getAllArtists();
      setArtists(res.artists || []);
    } catch (err) {
      toast.error("Failed to load artists");
    } finally {
      setLoadingArtists(false);
    }
  };

  const loadAlbums = async () => {
    try {
      setLoadingAlbums(true);
      const res = await albumService.getAllAlbums();
      setAlbums(res.albums || []);
    } catch (err) {
      toast.error("Failed to load albums");
    } finally {
      setLoadingAlbums(false);
    }
  };

  const filteredAlbums = useMemo(() => {
    if (!formData.artist) return [];

    return albums.filter(
      (album) =>
        album.artistId &&
        (album.artistId._id === formData.artist ||
          album.artistId === formData.artist),
    );
  }, [albums, formData.artist]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (clearError) clearError(name);

    if (name === "artist") {
      if (clearError) clearError("album");

      setFormData((prev) => ({
        ...prev,
        artist: value,
        album: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const artistLabel = (artist) =>
    artist.stageName ||
    artist.artistName ||
    artist.name ||
    artist.userId?.name ||
    "Unknown Artist";

  const albumLabel = (album) => album.title || album.name || "Untitled Album";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">Song Information</h2>

        <p className="mt-1 text-sm text-zinc-400">
          Basic metadata for this song.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Song Title *
          </label>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter song title"
            className={inputClass(errors.title)}
          />

          <ErrorText message={errors.title} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Duration *</label>

          <div
            className={`flex min-h-[50px] items-center rounded-xl border bg-black px-4 py-3 transition ${
              errors.audio128 ? "border-red-500" : "border-zinc-800"
            }`}
          >
            {formData.duration ? (
              <div>
                <p className="text-sm font-medium text-white">
                  {formData.duration}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Automatically detected from audio file
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Select audio file to detect duration
              </p>
            )}
          </div>

          <ErrorText message={errors.audio128} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Artist *</label>

          <select
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            disabled={loadingArtists}
            className={inputClass(errors.artist)}
          >
            <option value="">
              {loadingArtists ? "Loading artists..." : "Select Artist"}
            </option>

            {artists.map((artist) => (
              <option key={artist._id} value={artist._id}>
                {artistLabel(artist)}
              </option>
            ))}
          </select>

          <ErrorText message={errors.artist} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Album</label>

          <select
            name="album"
            value={formData.album}
            onChange={handleChange}
            disabled={!formData.artist || loadingAlbums}
            className={`${inputClass(errors.album)} disabled:opacity-50`}
          >
            <option value="">
              {!formData.artist
                ? "Select Artist First"
                : loadingAlbums
                  ? "Loading Albums..."
                  : "Select Album"}
            </option>

            {filteredAlbums.map((album) => (
              <option key={album._id} value={album._id}>
                {albumLabel(album)}
              </option>
            ))}
          </select>

          <ErrorText message={errors.album} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Genre *</label>

          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className={inputClass(errors.genre)}
          >
            <option value="">Select Genre</option>

            {genres.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>

          <ErrorText message={errors.genre} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Language *</label>

          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className={inputClass(errors.language)}
          >
            <option value="">Select Language</option>

            {languages.map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>

          <ErrorText message={errors.language} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Release Date
          </label>

          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className={inputClass(errors.releaseDate)}
          />

          <ErrorText message={errors.releaseDate} />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Lyrics</label>

          <textarea
            rows={8}
            name="lyrics"
            value={formData.lyrics}
            onChange={handleChange}
            placeholder="Paste lyrics..."
            className={`${inputClass(errors.lyrics)} resize-none`}
          />

          <ErrorText message={errors.lyrics} />
        </div>
      </div>
    </div>
  );
};

export default SongInformationForm;
