// src/components/settings/MaintenanceMode.jsx

import { AlertTriangle, Clock, Power, ShieldAlert } from "lucide-react";

import Button from "../ui/Button";

const MaintenanceMode = ({
  settings = {},
  onChange,
  onSave,
  saving = false,
}) => {
  const enabled = settings.enabled ?? false;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
            <ShieldAlert size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Maintenance Mode
            </h2>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Temporarily disable public access while keeping the admin
              dashboard available for maintenance and updates.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <Power size={22} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Enable Maintenance Mode
              </h3>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                When enabled, users will see a maintenance message instead of
                accessing the public platform.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange?.("enabled", !enabled)}
            className={`relative h-8 w-14 rounded-full transition ${
              enabled ? "bg-pink-500" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                enabled ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <AlertTriangle size={20} />
            </div>

            <h3 className="text-lg font-semibold text-white">
              Maintenance Message
            </h3>
          </div>

          <textarea
            rows="7"
            value={
              settings.message ??
              "Tantha Music is currently undergoing scheduled maintenance. We'll be back shortly with improvements."
            }
            onChange={(e) => onChange?.("message", e.target.value)}
            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white outline-none focus:border-pink-500"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <Clock size={20} />
            </div>

            <h3 className="text-lg font-semibold text-white">
              Schedule Maintenance
            </h3>
          </div>

          <div className="space-y-4">
            <input
              type="datetime-local"
              value={settings.startTime ?? ""}
              onChange={(e) => onChange?.("startTime", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="datetime-local"
              value={settings.endTime ?? ""}
              onChange={(e) => onChange?.("endTime", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <select
              value={settings.accessMode ?? "Admins Only"}
              onChange={(e) => onChange?.("accessMode", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="Admins Only">Admins Only</option>
              <option value="Admins and Artists">Admins and Artists</option>
              <option value="Disable All Access">Disable All Access</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={() => window.alert(settings.message)}
        >
          Preview Message
        </Button>

        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Maintenance Settings"}
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceMode;
