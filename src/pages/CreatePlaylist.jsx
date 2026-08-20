import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, ListMusic, Music4, Save } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";

import playlistService from "../services/playlistService";
import songService from "../services/songService";

const CreatePlaylist = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [songsLoading, setSongsLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songSearch, setSongSearch] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: null,
    isPublic: true,
    isFeatured: false,
  });

  const coverPreview = useMemo(() => {
    if (!formData.coverImage) return "";
    return URL.createObjectURL(formData.coverImage);
  }, [formData.coverImage]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setSongsLoading(true);
        const response = await songService.getAllSongs();

        const data =
          response?.data?.songs ||
          response?.data?.data ||
          response?.songs ||
          response?.data ||
          [];

        setSongs(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load songs");
        setSongs([]);
      } finally {
        setSongsLoading(false);
      }
    };

    loadSongs();
  }, []);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  /**
   * Narrows the picker by title, artist, genre or language.
   *
   * A playlist is built from a catalogue of hundreds, so scrolling the whole
   * list to find one track was the only way to add it. Filtering happens on
   * the songs already loaded, so typing costs no requests.
   */
  const visibleSongs = useMemo(() => {
    const keyword = songSearch.trim().toLowerCase();

    return songs.filter((song) => {
      if (showSelectedOnly && !selectedSongs.includes(song._id)) return false;
      if (!keyword) return true;

      const credit = [
        song?.artistId?.stageName,
        song?.artistId?.artistName,
        song?.artistId?.name,
        ...(song?.featuredArtists || []).map(
          (a) => a?.stageName || a?.artistName || a?.name,
        ),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        song?.title?.toLowerCase().includes(keyword) ||
        credit.includes(keyword) ||
        song?.genre?.toLowerCase().includes(keyword) ||
        song?.language?.toLowerCase().includes(keyword)
      );
    });
  }, [songs, songSearch, showSelectedOnly, selectedSongs]);

  const toggleSong = (songId) => {
    setSelectedSongs((current) => {
      if (current.includes(songId)) {
        return current.filter((id) => id !== songId);
      }

      return [...current, songId];
    });
  };

  const getArtistName = (song) => {
    return (
      song?.artistId?.stageName ||
      song?.artistId?.artistName ||
      song?.artistId?.name ||
      song?.artist?.stageName ||
      song?.artist?.artistName ||
      song?.artist?.name ||
      song?.artistName ||
      "Unknown Artist"
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Playlist title is required");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("isPublic", String(formData.isPublic));
      data.append("isFeatured", String(formData.isFeatured));
      data.append("createdByAdmin", "true");

      if (formData.coverImage) {
        data.append("cover", formData.coverImage);
      }

      const response = await playlistService.createPlaylist(data);
      const playlist =
        response?.data?.playlist || response?.playlist || response?.data?.data;

      if (playlist?._id && selectedSongs.length > 0) {
        await Promise.all(
          selectedSongs.map((songId) =>
            playlistService.addSong(playlist._id, songId),
          ),
        );
      }

      toast.success("Playlist created successfully");
      navigate("/playlists");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create playlist",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        title="Create Playlist"
        description="Create editorial, featured, or community playlists."
        action={
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/playlists")}
          >
            <ArrowLeft size={18} />
            Back
          </Button>
        }
      />

      <SectionCard
        title="Playlist Details"
        description="Add basic playlist information."
      >
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Cover Image
            </label>

            <label className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/40 text-center transition hover:border-pink-500/60">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Playlist cover preview"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="space-y-3">
                  <ImagePlus className="mx-auto text-white/40" size={38} />
                  <p className="text-sm text-white/50">Upload cover</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: event.target.files?.[0] || null,
                  }))
                }
              />
            </label>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Playlist Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder="Example: Tantha Top Hits"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe this playlist..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pink-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">Public</p>
                  <p className="text-xs text-white/40">Visible to users</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublic: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-pink-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">Featured</p>
                  <p className="text-xs text-white/40">
                    Highlight this playlist
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-pink-500"
                />
              </label>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Add Songs"
        description="Select songs to include in this playlist."
      >
        {songsLoading ? (
          <div className="rounded-xl border border-white/10 bg-black p-6 text-sm text-white/50">
            Loading songs...
          </div>
        ) : songs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black p-6 text-center">
            <Music4 className="mx-auto mb-3 text-white/30" size={36} />
            <p className="text-sm text-white/50">No songs available.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchBar
                value={songSearch}
                onChange={setSongSearch}
                onClear={() => setSongSearch("")}
                placeholder="Search songs, artists, genre..."
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSelectedOnly((v) => !v)}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    showSelectedOnly
                      ? "border-pink-500 text-white"
                      : "border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  Selected ({selectedSongs.length})
                </button>

                <span className="text-xs text-white/40">
                  {visibleSongs.length} of {songs.length}
                </span>
              </div>
            </div>

            {visibleSongs.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black p-6 text-center">
                <p className="text-sm text-white/50">
                  {showSelectedOnly
                    ? "No songs selected yet."
                    : `No songs match "${songSearch.trim()}".`}
                </p>
              </div>
            ) : (
          <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-black/40">
            {visibleSongs.map((song) => (
              <label
                key={song._id}
                className="flex cursor-pointer items-center gap-4 border-b border-white/10 p-4 last:border-b-0 hover:bg-white/[0.03]"
              >
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(song._id)}
                  onChange={() => toggleSong(song._id)}
                  className="h-5 w-5 accent-pink-500"
                />

                {song?.coverImage ? (
                  <img
                    src={song.coverImage}
                    alt={song?.title || "Song cover"}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                    <ListMusic size={20} className="text-white/30" />
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-white">
                    {song?.title || "Untitled"}
                  </p>
                  <p className="text-xs text-white/40">{getArtistName(song)}</p>
                </div>
              </label>
            ))}
          </div>
            )}
          </>
        )}
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/playlists")}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={saving}>
          <Save size={18} />
          {saving ? "Creating..." : "Create Playlist"}
        </Button>
      </div>
    </form>
  );
};

export default CreatePlaylist;
