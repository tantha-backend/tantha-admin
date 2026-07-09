import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";

import SongInformationForm from "../components/songs/SongInformationForm";
import MediaUploadForm from "../components/songs/MediaUploadForm";
import MonetizationSettings from "../components/songs/MonetizationSettings";

import songService from "../services/songService";

const initialFormData = {
  title: "",
  duration: "",
  artist: "",
  album: "",
  genre: "",
  language: "",
  lyrics: "",
  releaseDate: "",
  coverImage: null,
  audio128: null,
  audio320: null,
  premium: false,
  coffee: true,
  fanClub: true,
  featured: false,
  status: "pending",
};

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return "";
  return Math.floor(seconds);
};

const UploadSong = () => {
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!formData.audio128) {
      setFormData((prev) => ({
        ...prev,
        duration: "",
      }));
      return;
    }

    const audioUrl = URL.createObjectURL(formData.audio128);
    const audio = new Audio(audioUrl);

    audio.addEventListener("loadedmetadata", () => {
      const detectedDuration = formatDuration(audio.duration);

      setFormData((prev) => ({
        ...prev,
        duration: detectedDuration,
      }));
    });

    audio.addEventListener("error", () => {
      setErrors((prev) => ({
        ...prev,
        audio128: "Could not detect audio duration",
      }));
    });

    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [formData.audio128]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Song title is required";
    }

    if (!formData.audio128) {
      newErrors.audio128 = "Audio 128 kbps file is required";
    }

    if (formData.audio128 && !formData.duration) {
      newErrors.audio128 = "Audio duration could not be detected";
    }

    if (!formData.artist) {
      newErrors.artist = "Artist is required";
    }

    if (!formData.genre) {
      newErrors.genre = "Genre is required";
    }

    if (!formData.language) {
      newErrors.language = "Language is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return false;
    }

    return true;
  };

  const clearError = (field) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();

    data.append("title", formData.title.trim());
    data.append("duration", String(formData.duration));
    data.append("artistId", formData.artist);
    data.append("genre", formData.genre);
    data.append("language", formData.language);
    data.append("lyrics", formData.lyrics || "");
    data.append("isPremiumOnly", String(formData.premium));
    data.append("audio128", formData.audio128);

    if (formData.album) data.append("albumId", formData.album);
    if (formData.audio320) data.append("audio320", formData.audio320);

    // Backend Multer expects this field name as "cover"
    if (formData.coverImage) data.append("cover", formData.coverImage);

    try {
      setUploading(true);
      setUploadProgress(0);

      await songService.uploadSong(data, (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        setUploadProgress(percent);
      });

      setSuccess(true);
      toast.success("Song uploaded successfully");

      setFormData(initialFormData);
      setErrors({});
      setUploadProgress(100);

      setTimeout(() => {
        navigate("/songs");
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Song upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        title="Upload Song"
        description="Add a new song to the Tantha Music platform."
      />

      {success && (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
          <p className="text-sm font-medium text-green-400">
            Song uploaded successfully. Redirecting to Songs...
          </p>
        </div>
      )}

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
      />

      <MonetizationSettings formData={formData} setFormData={setFormData} />

      {uploading && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Uploading song...</p>
            <p className="text-sm text-zinc-400">{uploadProgress}%</p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-pink-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/songs")}
          disabled={uploading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={uploading || success}>
          {uploading ? `Uploading ${uploadProgress}%` : "Upload Song"}
        </Button>
      </div>
    </form>
  );
};

export default UploadSong;