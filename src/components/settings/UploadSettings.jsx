// src/components/settings/UploadSettings.jsx

import {
  FileAudio,
  FileImage,
  HardDriveUpload,
  ShieldCheck,
  Upload,
} from "lucide-react";

import Button from "../ui/Button";

const UploadSettings = ({
  settings = {},
  onChange,
  onSave,
  saving = false,
}) => {
  const toggleValue = (field, fallback = true) => {
    onChange?.(field, !(settings[field] ?? fallback));
  };

  const ToggleCard = ({ icon, title, description, value, onToggle }) => (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition ${
          value ? "bg-pink-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            value ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold text-white">Upload Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Configure upload limits, supported formats, moderation rules, and
          media processing.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <HardDriveUpload size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Upload Limits</h3>
          </div>

          <div className="space-y-4">
            <input
              type="number"
              min="1"
              value={settings.maxAudioFileSizeMB ?? 50}
              onChange={(e) =>
                onChange?.("maxAudioFileSizeMB", Number(e.target.value))
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="number"
              min="1"
              value={settings.maxCoverImageSizeMB ?? 10}
              onChange={(e) =>
                onChange?.("maxCoverImageSizeMB", Number(e.target.value))
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="number"
              min="1"
              value={settings.maxSongDurationMinutes ?? 15}
              onChange={(e) =>
                onChange?.("maxSongDurationMinutes", Number(e.target.value))
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <Upload size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Supported Formats
            </h3>
          </div>

          <div className="space-y-4">
            {[
              ["audioFormat", ["MP3", "WAV", "FLAC", "AAC"]],
              ["coverImageFormat", ["JPG / JPEG", "PNG", "WEBP"]],
              ["compression", ["Automatic", "Lossless", "Maximum Compression"]],
            ].map(([field, options]) => (
              <select
                key={field}
                value={settings[field] ?? options[0]}
                onChange={(e) => onChange?.(field, e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleCard
          icon={<ShieldCheck size={20} />}
          title="Admin Approval Required"
          description="Every uploaded song must be approved before publishing."
          value={settings.adminApprovalRequired ?? true}
          onToggle={() => toggleValue("adminApprovalRequired")}
        />

        <ToggleCard
          icon={<FileAudio size={20} />}
          title="Automatic Audio Processing"
          description="Generate streaming versions after upload."
          value={settings.automaticAudioProcessing ?? true}
          onToggle={() => toggleValue("automaticAudioProcessing")}
        />

        <ToggleCard
          icon={<FileImage size={20} />}
          title="Automatic Cover Optimization"
          description="Optimize uploaded artwork for all devices."
          value={settings.automaticCoverOptimization ?? true}
          onToggle={() => toggleValue("automaticCoverOptimization")}
        />

        <ToggleCard
          icon={<Upload size={20} />}
          title="Allow Artist Uploads"
          description="Verified artists can upload music from their dashboard."
          value={settings.allowArtistUploads ?? true}
          onToggle={() => toggleValue("allowArtistUploads")}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Upload Settings"}
        </Button>
      </div>
    </div>
  );
};

export default UploadSettings;
