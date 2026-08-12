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

  // Newly picked files, and what to show in the preview — either the existing
  // stored image or a local object URL for a file just chosen.
  const [images, setImages] = useState({ profileImage: null, coverImage: null });
  const [previews, setPreviews] = useState({ profileImage: "", coverImage: "" });

  const [formData, setFormData] = useState({
    stageName: "",
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
        bio: artist.bio || "",
        facebook: artist.socialLinks?.facebook || "",
        instagram: artist.socialLinks?.instagram || "",
        youtube: artist.socialLinks?.youtube || "",
        spotify: artist.socialLinks?.spotify || "",
        isVerified: Boolean(artist.isVerified),
        isMonetized: Boolean(artist.isMonetized),
        fanClubPrice: artist.fanClubPrice ?? 99,
      });

      setPreviews({
        profileImage: artist.profileImage || "",
        coverImage: artist.coverImage || "",
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

  const handleImageChange = (field, file) => {
    if (!file) return;

    setImages((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.stageName.trim()) {
      toast.error("Stage name is required");
      return;
    }

    try {
      setSaving(true);

      // Multipart so the images can travel with the rest of the fields.
      const payload = new FormData();

      payload.append("stageName", formData.stageName.trim());
      payload.append("bio", formData.bio.trim());
      payload.append("isVerified", String(formData.isVerified));
      payload.append("isMonetized", String(formData.isMonetized));
      payload.append("fanClubPrice", String(Number(formData.fanClubPrice || 99)));

      // Multipart can't carry a nested object, so send it as JSON.
      payload.append(
        "socialLinks",
        JSON.stringify({
          facebook: formData.facebook.trim(),
          instagram: formData.instagram.trim(),
          youtube: formData.youtube.trim(),
          spotify: formData.spotify.trim(),
        }),
      );

      if (images.profileImage) {
        payload.append("profileImage", images.profileImage);
      }

      if (images.coverImage) {
        payload.append("coverImage", images.coverImage);
      }

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

      <SectionCard title="Artist Images">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Profile Image
            </label>

            <div className="rounded-xl border border-dashed border-white/10 bg-black p-4">
              {previews.profileImage ? (
                <img
                  src={previews.profileImage}
                  alt="Profile preview"
                  className="mb-4 h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-pink-500 text-4xl font-bold text-white">
                  {formData.stageName?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange("profileImage", e.target.files?.[0])
                }
                className="block w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-pink-600"
              />

              <p className="mt-2 text-xs text-white/40">
                Square images look best. Replaces the current picture.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Cover Image
            </label>

            <div className="rounded-xl border border-dashed border-white/10 bg-black p-4">
              {previews.coverImage ? (
                <img
                  src={previews.coverImage}
                  alt="Cover preview"
                  className="mb-4 h-32 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mb-4 h-32 w-full rounded-xl bg-gradient-to-r from-pink-500/30 to-indigo-500/30" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange("coverImage", e.target.files?.[0])
                }
                className="block w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-pink-600"
              />

              <p className="mt-2 text-xs text-white/40">
                Wide banner shown at the top of the artist page.
              </p>
            </div>
          </div>
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
