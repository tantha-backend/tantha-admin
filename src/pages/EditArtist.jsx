import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import Button from "../components/ui/Button";
import artistService from "../services/artistService";

const EditArtist = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    stageName: "",
    artistName: "",
    genre: "",
    bio: "",
    facebook: "",
    instagram: "",
    youtube: "",
    spotify: "",
    isVerified: false,
    isMonetized: false,
    fanClubPrice: 99,
  });

  const loadArtist = async () => {
    try {
      setLoading(true);

      const res = await artistService.getArtistById(id);
      const artist = res.artist || res.data?.artist || res;

      setFormData({
        stageName: artist.stageName || "",
        artistName: artist.artistName || "",
        genre: artist.genre || "",
        bio: artist.bio || "",
        facebook: artist.socialLinks?.facebook || "",
        instagram: artist.socialLinks?.instagram || "",
        youtube: artist.socialLinks?.youtube || "",
        spotify: artist.socialLinks?.spotify || "",
        isVerified: Boolean(artist.isVerified),
        isMonetized: Boolean(artist.isMonetized),
        fanClubPrice: artist.fanClubPrice ?? 99,
      });
    } catch (error) {
      toast.error("Failed to load artist");
      navigate("/artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtist();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.stageName.trim()) {
      toast.error("Stage name is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        stageName: formData.stageName.trim(),
        artistName: formData.artistName.trim(),
        genre: formData.genre.trim(),
        bio: formData.bio.trim(),
        isVerified: formData.isVerified,
        isMonetized: formData.isMonetized,
        fanClubPrice: Number(formData.fanClubPrice || 99),
        socialLinks: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          youtube: formData.youtube,
          spotify: formData.spotify,
        },
      };

      await artistService.updateArtist(id, payload);

      toast.success("Artist updated successfully");
      navigate(`/artists/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update artist");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white/50">Loading artist...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        title="Edit Artist"
        description="Update artist profile, verification and monetization settings."
        action={
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/artists/${id}`)}
          >
            <ArrowLeft size={18} />
            Back
          </Button>
        }
      />

      <SectionCard title="Artist Information">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Stage Name
            </label>
            <input
              value={formData.stageName}
              onChange={(e) => handleChange("stageName", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Artist Name
            </label>
            <input
              value={formData.artistName}
              onChange={(e) => handleChange("artistName", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Genre
            </label>
            <input
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Fan Club Price
            </label>
            <input
              type="number"
              value={formData.fanClubPrice}
              onChange={(e) => handleChange("fanClubPrice", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-white">
            Bio
          </label>
          <textarea
            rows={5}
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
          />
        </div>
      </SectionCard>

      <SectionCard title="Social Links">
        <div className="grid gap-5 md:grid-cols-2">
          <input
            placeholder="Facebook"
            value={formData.facebook}
            onChange={(e) => handleChange("facebook", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
          />

          <input
            placeholder="Instagram"
            value={formData.instagram}
            onChange={(e) => handleChange("instagram", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
          />

          <input
            placeholder="YouTube"
            value={formData.youtube}
            onChange={(e) => handleChange("youtube", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
          />

          <input
            placeholder="Spotify"
            value={formData.spotify}
            onChange={(e) => handleChange("spotify", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
          />
        </div>
      </SectionCard>

      <SectionCard title="Status">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3">
            <span className="text-sm text-white">Verified Artist</span>
            <input
              type="checkbox"
              checked={formData.isVerified}
              onChange={(e) => handleChange("isVerified", e.target.checked)}
              className="h-5 w-5 accent-pink-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3">
            <span className="text-sm text-white">Monetization Enabled</span>
            <input
              type="checkbox"
              checked={formData.isMonetized}
              onChange={(e) => handleChange("isMonetized", e.target.checked)}
              className="h-5 w-5 accent-pink-500"
            />
          </label>
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(`/artists/${id}`)}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={saving}>
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditArtist;
