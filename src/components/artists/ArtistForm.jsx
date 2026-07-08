import { useState } from "react";
import Button from "../ui/Button";

const initialState = {
  userId: "",
  stageName: "",
  bio: "",
  fanClubPrice: 99,
  isVerified: false,
  isMonetized: true,
  profileImage: null,
  coverImage: null,
};

function ArtistForm({
  mode = "create",
  initialData = null,
  loading = false,
  usersLoading = false,
  availableUsers = [],
  onRefreshUsers,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    ...initialState,
    ...initialData,
    userId: initialData?.userId?._id || initialData?.userId || "",
  });

  const [errors, setErrors] = useState({});
  const [profilePreview, setProfilePreview] = useState(
    initialData?.profileImage || "",
  );
  const [coverPreview, setCoverPreview] = useState(
    initialData?.coverImage || "",
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    const previewUrl = URL.createObjectURL(file);

    if (name === "profileImage") {
      setProfilePreview(previewUrl);
    }

    if (name === "coverImage") {
      setCoverPreview(previewUrl);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (mode === "create" && !formData.userId) {
      newErrors.userId = "Please select a user";
    }

    if (!formData.stageName.trim()) {
      newErrors.stageName = "Stage name is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Biography is required";
    }

    if (
      formData.fanClubPrice === "" ||
      Number.isNaN(Number(formData.fanClubPrice)) ||
      Number(formData.fanClubPrice) < 0
    ) {
      newErrors.fanClubPrice = "Enter a valid fan club price";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const submitData = new FormData();

    if (mode === "create") {
      submitData.append("userId", formData.userId);
    }

    submitData.append("stageName", formData.stageName);
    submitData.append("bio", formData.bio);
    submitData.append("fanClubPrice", formData.fanClubPrice);
    submitData.append("isVerified", formData.isVerified);
    submitData.append("isMonetized", formData.isMonetized);

    if (formData.profileImage) {
      submitData.append("profileImage", formData.profileImage);
    }

    if (formData.coverImage) {
      submitData.append("coverImage", formData.coverImage);
    }

    onSubmit(submitData);
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 ${
      errors[field] ? "border-red-500" : "border-white/10 focus:border-pink-500"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "create" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Select Existing User
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Only normal users without an artist profile will appear here.
              </p>
            </div>

            {onRefreshUsers && (
              <Button
                type="button"
                onClick={onRefreshUsers}
                disabled={usersLoading}
              >
                {usersLoading ? "Loading..." : "Refresh Users"}
              </Button>
            )}
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-white/60">
              User Account
            </label>

            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              disabled={usersLoading}
              className={inputClass("userId")}
            >
              <option value="">
                {usersLoading ? "Loading users..." : "Select a user"}
              </option>

              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} — {user.email}
                </option>
              ))}
            </select>

            {errors.userId && (
              <p className="mt-2 text-xs text-red-400">{errors.userId}</p>
            )}

            {!usersLoading && availableUsers.length === 0 && (
              <p className="mt-3 text-sm text-yellow-400">
                No available users found. Create a normal user account first, or
                check if all users are already artists.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Artist Information</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/60">
              Stage Name
            </label>
            <input
              name="stageName"
              value={formData.stageName}
              onChange={handleChange}
              placeholder="Enter stage name"
              className={inputClass("stageName")}
            />
            {errors.stageName && (
              <p className="mt-2 text-xs text-red-400">{errors.stageName}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Fan Club Price
            </label>
            <input
              type="number"
              name="fanClubPrice"
              value={formData.fanClubPrice}
              onChange={handleChange}
              placeholder="99"
              min="0"
              className={inputClass("fanClubPrice")}
            />
            {errors.fanClubPrice && (
              <p className="mt-2 text-xs text-red-400">{errors.fanClubPrice}</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-white/60">Biography</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write artist biography..."
            rows={5}
            className={inputClass("bio")}
          />
          {errors.bio && (
            <p className="mt-2 text-xs text-red-400">{errors.bio}</p>
          )}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-4">
            <div>
              <p className="text-sm font-medium text-white">Verified Artist</p>
              <p className="mt-1 text-xs text-white/40">
                Show verified badge on artist profile.
              </p>
            </div>
            <input
              type="checkbox"
              name="isVerified"
              checked={formData.isVerified}
              onChange={handleChange}
              className="h-5 w-5 accent-pink-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-4">
            <div>
              <p className="text-sm font-medium text-white">Monetization</p>
              <p className="mt-1 text-xs text-white/40">
                Enable fan club and support features.
              </p>
            </div>
            <input
              type="checkbox"
              name="isMonetized"
              checked={formData.isMonetized}
              onChange={handleChange}
              className="h-5 w-5 accent-pink-500"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Artist Images</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/60">
              Profile Image
            </label>

            <div className="rounded-xl border border-dashed border-white/10 bg-black p-4">
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="mb-4 h-32 w-32 rounded-full object-cover"
                />
              )}

              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-pink-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Cover Image
            </label>

            <div className="rounded-xl border border-dashed border-white/10 bg-black p-4">
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="mb-4 h-32 w-full rounded-xl object-cover"
                />
              )}

              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-pink-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading || usersLoading}>
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Artist Profile"
              : "Save Artist"}
        </Button>
      </div>
    </form>
  );
}

export default ArtistForm;
