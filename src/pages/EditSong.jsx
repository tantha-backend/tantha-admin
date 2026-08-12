import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import LoadingState from "../components/common/LoadingState";

import SongInformationForm from "../components/songs/SongInformationForm";
import MediaUploadForm from "../components/songs/MediaUploadForm";
import MonetizationSettings from "../components/songs/MonetizationSettings";

import songService from "../services/songService";
import { toDurationSeconds } from "../utils/time";

const idOf = (value) => {
  if (!value) return "";
  return typeof value === "object" ? value._id || "" : value;
};

const EditSong = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const loadSong = async () => {
      try {
        setLoading(true);

        const res = await songService.getAdminSongById(id);
        const song = res.song || res.data || res;

        setFormData({
          title: song.title || "",
          duration: song.duration || "",
          artist: idOf(song.artistId),
          album: idOf(song.albumId),
          featuredArtists: (song.featuredArtists || []).map(idOf),
          genre: song.genre || "",
          language: song.language || "",
          lyrics: song.lyrics || "",
          releaseDate: song.releaseDate ? song.releaseDate.slice(0, 10) : "",
          coverImage: null,
          audio320: null,
          premium: Boolean(song.isPremiumOnly),
          coffee: song.isCoffeeSupportEnabled !== false,
          fanClub: song.isFanClubOnly === true,
          featured: Boolean(song.isFeatured),
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load song");
        navigate("/songs");
      } finally {
        setLoading(false);
      }
    };

    loadSong();
  }, [id, navigate]);

  // Re-detect duration only when a replacement file is chosen; otherwise the
  // song keeps the duration it was uploaded with.
  useEffect(() => {
    if (!formData?.audio320) return;

    const audioUrl = URL.createObjectURL(formData.audio320);
    const audio = new Audio(audioUrl);

    audio.addEventListener("loadedmetadata", () => {
      setFormData((prev) => ({
        ...prev,
        duration: toDurationSeconds(audio.duration),
      }));
    });

    audio.addEventListener("error", () => {
      setErrors((prev) => ({
        ...prev,
        audio320: "Could not detect audio duration",
      }));
    });

    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [formData?.audio320]);

  const clearError = (field) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Song title is required";
    if (!formData.artist) newErrors.artist = "Artist is required";
    if (!formData.genre) newErrors.genre = "Genre is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.duration) newErrors.audio320 = "Duration is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();

    data.append("title", formData.title.trim());
    data.append("duration", String(formData.duration));
    data.append("artistId", formData.artist);
    data.append("genre", formData.genre);
    data.append("language", formData.language);
    data.append("lyrics", formData.lyrics || "");
    data.append("isPremiumOnly", String(formData.premium));
    data.append("albumId", formData.album || "");
    data.append("featuredArtists", JSON.stringify(formData.featuredArtists));

    // Files are only sent when the user picked a replacement.
    if (formData.audio320) data.append("audio320", formData.audio320);
    if (formData.coverImage) data.append("cover", formData.coverImage);

    try {
      setSaving(true);
      setProgress(0);

      await songService.updateSong(id, data, (event) => {
        if (!event.total) return;
        setProgress(Math.round((event.loaded * 100) / event.total));
      });

      toast.success("Song updated successfully");
      navigate("/songs");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update song");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return <LoadingState text="Loading song..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        title="Edit Song"
        description="Update this song's details, artwork or audio."
      />

      <SongInformationForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        clearError={clearError}
      />

      <MediaUploadForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        clearError={clearError}
        audioRequired={false}
      />

      <MonetizationSettings formData={formData} setFormData={setFormData} />

      {saving && progress > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Saving changes...</p>
            <p className="text-sm text-zinc-400">{progress}%</p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-pink-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/songs")}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditSong;
