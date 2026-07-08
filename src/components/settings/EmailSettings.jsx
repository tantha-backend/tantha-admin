import { MailCheck, Save, Send, Server, ShieldCheck } from "lucide-react";

import Button from "../ui/Button";

const EmailSettings = ({ settings = {}, onChange, onSave, saving }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold text-white">Email Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Configure SMTP, sender details, and platform email delivery.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <Server size={20} />
            </div>

            <h3 className="text-lg font-semibold text-white">
              SMTP Configuration
            </h3>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="SMTP Host"
              value={settings.smtpHost || ""}
              onChange={(event) => onChange("smtpHost", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="number"
              placeholder="SMTP Port"
              value={settings.smtpPort || ""}
              onChange={(event) =>
                onChange("smtpPort", Number(event.target.value))
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="text"
              placeholder="SMTP Username"
              value={settings.smtpUsername || ""}
              onChange={(event) => onChange("smtpUsername", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="password"
              placeholder="SMTP Password"
              value={settings.smtpPassword || ""}
              onChange={(event) => onChange("smtpPassword", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <MailCheck size={20} />
            </div>

            <h3 className="text-lg font-semibold text-white">
              Sender Information
            </h3>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Sender Name"
              value={settings.senderName || ""}
              onChange={(event) => onChange("senderName", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="email"
              placeholder="Sender Email"
              value={settings.senderEmail || ""}
              onChange={(event) => onChange("senderEmail", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <input
              type="email"
              placeholder="Support Email"
              value={settings.supportEmail || ""}
              onChange={(event) => onChange("supportEmail", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            />

            <select
              value={settings.encryption || "TLS"}
              onChange={(event) => onChange("encryption", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            >
              <option value="TLS">Use TLS Encryption</option>
              <option value="SSL">Use SSL Encryption</option>
              <option value="None">No Encryption</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h3 className="text-lg font-semibold text-white">Email Actions</h3>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary">
            <Send size={16} />
            Send Test Email
          </Button>

          <Button type="button" variant="secondary">
            <ShieldCheck size={16} />
            Verify SMTP
          </Button>

          <Button type="button" onClick={onSave} disabled={saving}>
            <Save size={16} />
            {saving ? "Saving..." : "Save Email Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
