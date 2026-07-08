import {
  KeyRound,
  Lock,
  MonitorCheck,
  Save,
  Shield,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

import Button from "../ui/Button";

const SecuritySettings = ({ settings = {}, onChange, onSave, saving }) => {
  const securityOptions = [
    {
      key: "twoFactorAuth",
      title: "Two-Factor Authentication",
      description: "Require additional verification for admin accounts.",
      icon: Shield,
    },
    {
      key: "strongPasswordPolicy",
      title: "Strong Password Policy",
      description: "Force users to create secure passwords.",
      icon: Lock,
    },
    {
      key: "adminLoginAlerts",
      title: "Admin Login Alerts",
      description: "Send alerts when an admin signs in.",
      icon: ShieldAlert,
    },
    {
      key: "deviceSessionTracking",
      title: "Device Session Tracking",
      description: "Track logged-in devices and active sessions.",
      icon: MonitorCheck,
    },
    {
      key: "roleBasedAccess",
      title: "Role-Based Access",
      description: "Restrict dashboard access based on user roles.",
      icon: UserCheck,
    },
    {
      key: "apiKeyProtection",
      title: "API Key Protection",
      description: "Protect private API keys and storage credentials.",
      icon: KeyRound,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold text-white">Security Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Configure admin authentication, access protection, and platform
          security rules.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {securityOptions.map((option) => {
          const Icon = option.icon;
          const enabled = Boolean(settings[option.key]);

          return (
            <div
              key={option.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {option.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {option.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onChange(option.key, !enabled)}
                className={`relative h-7 min-w-12 rounded-full transition ${
                  enabled ? "bg-pink-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    enabled ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h3 className="text-lg font-semibold text-white">Session Management</h3>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Admin Session Expiry
            </label>

            <select
              value={settings.adminSessionExpiry || "7 Days"}
              onChange={(event) =>
                onChange("adminSessionExpiry", event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="7 Days">7 Days</option>
              <option value="24 Hours">24 Hours</option>
              <option value="12 Hours">12 Hours</option>
              <option value="1 Hour">1 Hour</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Max Login Attempts
            </label>

            <input
              type="number"
              min="1"
              value={settings.maxLoginAttempts || 5}
              onChange={(event) =>
                onChange("maxLoginAttempts", Number(event.target.value))
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Lockout Duration
            </label>

            <select
              value={settings.lockoutDuration || "15 Minutes"}
              onChange={(event) =>
                onChange("lockoutDuration", event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="15 Minutes">15 Minutes</option>
              <option value="30 Minutes">30 Minutes</option>
              <option value="1 Hour">1 Hour</option>
              <option value="24 Hours">24 Hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Security Settings"}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
