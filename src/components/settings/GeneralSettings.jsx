import { Save } from "lucide-react";

import Button from "../ui/Button";

const GeneralSettings = ({ settings = {}, onChange, onSave, saving }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">General Settings</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Basic platform information and public app details.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Platform Name
          </label>

          <input
            value={settings.platformName || ""}
            onChange={(event) => onChange("platformName", event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            placeholder="Tantha Music"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Support Email
          </label>

          <input
            type="email"
            value={settings.supportEmail || ""}
            onChange={(event) => onChange("supportEmail", event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            placeholder="support@tanthamusic.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Timezone
          </label>

          <select
            value={settings.timezone || "Asia/Kolkata"}
            onChange={(event) => onChange("timezone", event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            <option value="Asia/Singapore">Asia/Singapore</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Platform Tagline
          </label>

          <textarea
            value={settings.platformTagline || ""}
            onChange={(event) =>
              onChange("platformTagline", event.target.value)
            }
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            placeholder="Describe your music platform..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;
