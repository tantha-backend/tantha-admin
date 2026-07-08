import {
  Database,
  HardDrive,
  Image,
  Music,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

import Button from "../ui/Button";

const StorageSettings = ({ settings = {}, onChange, onSave, saving }) => {
  const storageStats = [
    {
      label: "Audio Storage",
      value: "42.8 GB",
      limit: "100 GB",
      percentage: 43,
      icon: Music,
    },
    {
      label: "Cover Images",
      value: "8.4 GB",
      limit: "25 GB",
      percentage: 34,
      icon: Image,
    },
    {
      label: "Database",
      value: "3.2 GB",
      limit: "20 GB",
      percentage: 16,
      icon: Database,
    },
    {
      label: "Backup Storage",
      value: "18.6 GB",
      limit: "50 GB",
      percentage: 37,
      icon: HardDrive,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Storage Settings
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Manage uploaded media, backups, database usage, and storage
              limits.
            </p>
          </div>

          <Button variant="secondary" type="button">
            <RefreshCw size={16} />
            Refresh Usage
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {storageStats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
                  <Icon size={22} />
                </div>

                <span className="text-xs text-zinc-500">
                  {item.percentage}%
                </span>
              </div>

              <h3 className="text-sm font-medium text-zinc-300">
                {item.label}
              </h3>

              <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>

              <p className="mt-1 text-xs text-zinc-500">of {item.limit} used</p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-pink-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold text-white">
            Upload Storage Provider
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            Configure where music files, thumbnails, and artist media are
            stored.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Storage Provider
              </label>

              <select
                value={settings.provider || "AWS S3"}
                onChange={(event) => onChange("provider", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500"
              >
                <option value="AWS S3">AWS S3</option>
                <option value="Cloudinary">Cloudinary</option>
                <option value="Local Storage">Local Storage</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Bucket Name
              </label>

              <input
                type="text"
                value={settings.bucketName || ""}
                onChange={(event) => onChange("bucketName", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500"
                placeholder="tantha-music-uploads"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Region
              </label>

              <input
                type="text"
                value={settings.region || ""}
                onChange={(event) => onChange("region", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500"
                placeholder="ap-south-1"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold text-white">
            Storage Maintenance
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            Clean unused media, optimize database storage, and manage backups.
          </p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black p-4 text-left transition hover:border-pink-500/50"
            >
              <div className="flex items-center gap-3">
                <UploadCloud className="text-pink-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-white">Sync Uploads</p>
                  <p className="text-xs text-zinc-500">
                    Recheck uploaded files with storage provider.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black p-4 text-left transition hover:border-pink-500/50"
            >
              <div className="flex items-center gap-3">
                <Database className="text-pink-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-white">
                    Optimize Database
                  </p>
                  <p className="text-xs text-zinc-500">
                    Clean indexes and improve database performance.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-left transition hover:border-red-500/50"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-red-300">
                    Remove Orphan Files
                  </p>
                  <p className="text-xs text-red-300/60">
                    Delete files not linked to any songs, artists, or albums.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Storage Settings"}
        </Button>
      </div>
    </div>
  );
};

export default StorageSettings;
