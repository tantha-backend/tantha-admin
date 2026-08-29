// src/components/settings/AppVersionSettings.jsx

import { useState } from "react";
import { AlertTriangle, Ban, Power, Smartphone, Sparkles } from "lucide-react";

import Button from "../ui/Button";

/**
 * The version gate.
 *
 * `latest` offers an update people can dismiss. `minimumSupported` takes the
 * app away from anyone below it, immediately, whether or not they are able to
 * update right then — so raising it asks for confirmation first, and the
 * confirmation names how many builds it shuts out rather than just asking
 * "are you sure".
 *
 * Empty means the rule is off. That is deliberate: a fresh database should
 * never gate anybody.
 */

const isVersion = (value) => /^\d+(\.\d+)*$/.test(String(value || "").trim());

const Field = ({ label, hint, value, placeholder, onChange, invalid }) => (
  <label className="block">
    <span className="text-sm font-medium text-white">{label}</span>
    {hint ? (
      <span className="mt-1 block text-xs leading-5 text-zinc-500">{hint}</span>
    ) : null}
    <input
      type="text"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`mt-2 w-full rounded-xl border bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 ${
        invalid
          ? "border-red-500/50 focus:ring-red-500/40"
          : "border-white/10 focus:ring-pink-500/40"
      }`}
    />
    {invalid ? (
      <span className="mt-1.5 block text-xs text-red-400">
        Use numbers and dots, like 1.0.0
      </span>
    ) : null}
  </label>
);

const AppVersionSettings = ({
  settings = {},
  onChange,
  onSave,
  saving = false,
}) => {
  const [confirming, setConfirming] = useState(false);

  const enabled = settings.enabled ?? true;
  const latest = settings.latest ?? "";
  const minimum = settings.minimumSupported ?? "";

  const latestInvalid = latest !== "" && !isVersion(latest);
  const minimumInvalid = minimum !== "" && !isVersion(minimum);

  // The mistake that strands everybody. The server ignores it too, but saying
  // so here means nobody has to discover that by shipping it.
  const minimumBeatsLatest =
    isVersion(latest) &&
    isVersion(minimum) &&
    latest.localeCompare(minimum, undefined, { numeric: true }) < 0;

  const blocks = isVersion(minimum);

  const submit = () => {
    if (blocks && !confirming) {
      setConfirming(true);
      return;
    }

    setConfirming(false);
    onSave?.();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
            <Smartphone size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">App version</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              What installed apps are told about their own version. Leave a
              field empty to turn that rule off.
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
                Version checking
              </h3>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Off means apps are never told anything, whatever is set below.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange?.("enabled", !enabled)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${
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

      <div className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-950 p-6 md:grid-cols-2">
        <div className="md:col-span-2 flex items-center gap-3">
          <Sparkles size={18} className="text-pink-400" />
          <h3 className="text-lg font-semibold text-white">Offer an update</h3>
        </div>

        <Field
          label="Latest version"
          hint="The newest build in the stores. Anything older is offered an update it can dismiss."
          value={latest}
          placeholder="1.0.0"
          invalid={latestInvalid}
          onChange={(v) => onChange?.("latest", v)}
        />

        <Field
          label="Update message"
          hint="Shown with the offer. Optional."
          value={settings.optionalMessage}
          placeholder="A new version of Tantha Music is available."
          onChange={(v) => onChange?.("optionalMessage", v)}
        />
      </div>

      <div className="grid gap-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 md:grid-cols-2">
        <div className="md:col-span-2 flex items-center gap-3">
          <Ban size={18} className="text-red-400" />
          <h3 className="text-lg font-semibold text-white">Block old builds</h3>
        </div>

        <Field
          label="Minimum supported version"
          hint="Anything older is blocked from using the app at all. Leave empty unless an old build is genuinely broken."
          value={minimum}
          placeholder="Leave empty to block nobody"
          invalid={minimumInvalid}
          onChange={(v) => onChange?.("minimumSupported", v)}
        />

        <Field
          label="Blocked message"
          hint="Shown to people who can no longer use the app."
          value={settings.requiredMessage}
          placeholder="This version is no longer supported. Please update to keep listening."
          onChange={(v) => onChange?.("requiredMessage", v)}
        />

        {minimumBeatsLatest ? (
          <div className="md:col-span-2 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
            <p className="text-sm leading-6 text-amber-200">
              The minimum ({minimum}) is newer than the latest release (
              {latest}). Everyone would be told to fetch a build that does not
              exist, so this rule is ignored until the two agree.
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-950 p-6 md:grid-cols-2">
        <Field
          label="Android store link"
          value={settings.storeUrlAndroid}
          placeholder="https://play.google.com/store/apps/details?id=com.tanthamusic.app"
          onChange={(v) => onChange?.("storeUrlAndroid", v)}
        />
        <Field
          label="iOS store link"
          value={settings.storeUrlIos}
          placeholder="https://apps.apple.com/app/..."
          onChange={(v) => onChange?.("storeUrlIos", v)}
        />
      </div>

      {confirming ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle size={22} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                This shuts people out straight away
              </h3>
              <p className="mt-1 text-sm leading-6 text-red-200">
                Everyone running a build older than{" "}
                <span className="font-semibold">{minimum}</span> loses access
                the moment this saves — including anyone who cannot update right
                now. Only do this if that build is genuinely broken.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={submit}
                  disabled={saving}
                  className="!bg-red-500 hover:!bg-red-400"
                >
                  {saving ? "Saving..." : `Block builds older than ${minimum}`}
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button
            onClick={submit}
            disabled={saving || latestInvalid || minimumInvalid}
          >
            {saving ? "Saving..." : "Save app version settings"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppVersionSettings;
