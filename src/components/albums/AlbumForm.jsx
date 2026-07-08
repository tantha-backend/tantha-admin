import { useEffect, useState } from "react";

import FormInput from "../common/FormInput";
import SectionCard from "../common/SectionCard";
import Button from "../ui/Button";

function AlbumForm({
  initialValues = {},
  artists = [],
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    title: "",
    artistId: "",
    description: "",
    genre: "",
    language: "Manipuri",
    releaseDate: "",
    labelName: "Tantha Music",
    copyrightLine: "",
    isPublished: false,
    isPremiumOnly: false,
    isFeatured: false,
    isCoffeeSupportEnabled: true,
    isFanClubExclusive: false,
    coverImage: null,
    bannerImage: null,
  });

  useEffect(() => {
    if (Object.keys(initialValues).length) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <SectionCard
        title="Album Information"
        description="Basic information about the album."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormInput
            label="Album Title"
            required
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Artist
            </label>

            <select
              value={form.artistId}
              onChange={(e) => handleChange("artistId", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-pink-500"
            >
              <option value="">Select Artist</option>

              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.stageName}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Genre"
            value={form.genre}
            onChange={(e) => handleChange("genre", e.target.value)}
          />

          <FormInput
            label="Language"
            value={form.language}
            onChange={(e) => handleChange("language", e.target.value)}
          />

          <FormInput
            label="Release Date"
            type="date"
            value={form.releaseDate}
            onChange={(e) => handleChange("releaseDate", e.target.value)}
          />

          <FormInput
            label="Record Label"
            value={form.labelName}
            onChange={(e) => handleChange("labelName", e.target.value)}
          />

          <div className="md:col-span-2">
            <FormInput
              label="Copyright Line"
              value={form.copyrightLine}
              onChange={(e) => handleChange("copyrightLine", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-white">
              Description
            </label>

            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 p-4 text-white outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Artwork" description="Album cover and banner.">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Cover Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("coverImage", e.target.files[0])}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Banner Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("bannerImage", e.target.files[0])}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 p-3 text-white"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Publishing"
        description="Album visibility and monetization."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => handleChange("isPublished", e.target.checked)}
            />
            Publish Album
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.isPremiumOnly}
              onChange={(e) => handleChange("isPremiumOnly", e.target.checked)}
            />
            Premium Only
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => handleChange("isFeatured", e.target.checked)}
            />
            Featured Album
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.isCoffeeSupportEnabled}
              onChange={(e) =>
                handleChange("isCoffeeSupportEnabled", e.target.checked)
              }
            />
            Coffee Support
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.isFanClubExclusive}
              onChange={(e) =>
                handleChange("isFanClubExclusive", e.target.checked)
              }
            />
            Fan Club Exclusive
          </label>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Album
        </Button>
      </div>
    </form>
  );
}

export default AlbumForm;
