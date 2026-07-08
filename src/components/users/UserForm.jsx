import { useEffect, useState } from "react";

import Button from "../ui/Button";
import FormInput from "../common/FormInput";

const defaultValues = {
  name: "",
  email: "",
  role: "user",
  status: "active",
  isPremium: false,
  premiumExpiresAt: "",
};

function UserForm({
  initialValues = defaultValues,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...defaultValues,
        ...initialValues,
        premiumExpiresAt: initialValues?.premiumExpiresAt
          ? new Date(initialValues.premiumExpiresAt).toISOString().slice(0, 10)
          : "",
      });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      premiumExpiresAt: form.isPremium ? form.premiumExpiresAt || null : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter user's name"
          required
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-white outline-none transition focus:border-pink-500"
          >
            <option value="user">User</option>
            <option value="artist">Artist</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Account Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-white outline-none transition focus:border-pink-500"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Premium Membership</h3>

            <p className="mt-1 text-sm text-zinc-400">
              Enable or disable premium access.
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="isPremium"
              checked={form.isPremium}
              onChange={handleChange}
              className="peer sr-only"
            />

            <div className="h-6 w-11 rounded-full bg-zinc-700 transition peer-checked:bg-pink-600 peer-after:absolute peer-after:left-[2px] peer-after:top-[2px] peer-after:h-5 peer-after:w-5 peer-after:rounded-full peer-after:bg-white peer-after:transition-all peer-checked:peer-after:translate-x-full" />
          </label>
        </div>

        {form.isPremium && (
          <div className="mt-5">
            <FormInput
              label="Premium Expiry"
              type="date"
              name="premiumExpiresAt"
              value={form.premiumExpiresAt}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
