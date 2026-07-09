import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

import Button from "../components/ui/Button";
import userService from "../services/userService";

const CreateUser = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
    isPremium: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);

      await userService.createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        status: formData.status,
        isPremium: formData.isPremium,
      });

      toast.success("User created successfully");
      navigate("/users");
    } catch (error) {
      console.error("Create user error:", error);
      toast.error(error?.response?.data?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate("/users")}>
          <ArrowLeft size={18} />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-white">Add User</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create a normal user, artist account, or admin account.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
      >
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-pink-500"
            placeholder="Test Artist User"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-pink-500"
            placeholder="testartist@tanthamusic.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-pink-500"
            placeholder="Test@12345"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-pink-500"
            >
              <option value="user">User</option>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-pink-500"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            name="isPremium"
            type="checkbox"
            checked={formData.isPremium}
            onChange={handleChange}
            className="h-4 w-4 accent-pink-500"
          />
          Premium user
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/users")}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={saving}>
            <Save size={18} />
            {saving ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
