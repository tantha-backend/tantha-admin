import { Gauge, Headphones, Radio, Save, Volume2 } from "lucide-react";

import Button from "../ui/Button";

const StreamingSettings = ({ settings = {}, onChange, onSave, saving }) => {
  const Toggle = ({ field }) => {
    const enabled = Boolean(settings[field]);

    return (
      <button
        type="button"
        onClick={() => onChange(field, !enabled)}
        className={`relative mt-4 h-7 w-12 rounded-full transition ${
          enabled ? "bg-pink-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold text-white">Streaming Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Manage playback quality, stream tracking, previews, and listener
          limits.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <Headphones size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Audio Playback</h3>
          </div>

          <div className="space-y-4">
            <select
              value={settings.defaultQuality || "128 kbps"}
              onChange={(event) =>
                onChange("defaultQuality", event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="128 kbps">Default Quality: 128 kbps</option>
              <option value="320 kbps">Default Quality: 320 kbps</option>
            </select>

            <select
              value={settings.premiumQuality || "320 kbps"}
              onChange={(event) =>
                onChange("premiumQuality", event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="320 kbps">Premium Quality: 320 kbps</option>
              <option value="128 kbps">Premium Quality: 128 kbps</option>
            </select>

            <input
              type="number"
              value={settings.previewDuration || 30}
              onChange={(event) =>
                onChange("previewDuration", Number(event.target.value))
              }
              placeholder="Preview Duration"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <select
              value={settings.autoplay ? "enabled" : "disabled"}
              onChange={(event) =>
                onChange("autoplay", event.target.value === "enabled")
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="enabled">Autoplay Enabled</option>
              <option value="disabled">Autoplay Disabled</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <Gauge size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Stream Tracking
            </h3>
          </div>

          <div className="space-y-4">
            <input
              type="number"
              value={settings.minimumPlaySeconds || 10}
              onChange={(event) =>
                onChange("minimumPlaySeconds", Number(event.target.value))
              }
              placeholder="Minimum seconds to count as play"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="number"
              value={settings.duplicatePlayCooldown || 60}
              onChange={(event) =>
                onChange("duplicatePlayCooldown", Number(event.target.value))
              }
              placeholder="Duplicate play cooldown in seconds"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <select
              value={settings.trackAnonymousPlays ? "enabled" : "disabled"}
              onChange={(event) =>
                onChange(
                  "trackAnonymousPlays",
                  event.target.value === "enabled",
                )
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="enabled">Track Anonymous Plays</option>
              <option value="disabled">Ignore Anonymous Plays</option>
            </select>

            <select
              value={settings.listeningHistory ? "enabled" : "disabled"}
              onChange={(event) =>
                onChange("listeningHistory", event.target.value === "enabled")
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="enabled">Enable Listening History</option>
              <option value="disabled">Disable Listening History</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
          <div className="mb-4 w-fit rounded-xl bg-pink-500/10 p-3 text-pink-400">
            <Radio size={20} />
          </div>

          <h3 className="text-sm font-semibold text-white">Public Streaming</h3>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Allow non-premium users to stream published public songs.
          </p>

          <Toggle field="publicStreaming" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
          <div className="mb-4 w-fit rounded-xl bg-pink-500/10 p-3 text-pink-400">
            <Volume2 size={20} />
          </div>

          <h3 className="text-sm font-semibold text-white">
            Audio Normalization
          </h3>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Normalize playback volume for a better listening experience.
          </p>

          <Toggle field="audioNormalization" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Streaming Settings"}
        </Button>
      </div>
    </div>
  );
};

export default StreamingSettings;
