import {
  BarChart3,
  Coffee,
  Crown,
  HeartHandshake,
  Music2,
  Radio,
  Save,
  ShieldCheck,
  Users,
} from "lucide-react";

import Button from "../ui/Button";

const FeatureToggle = ({ settings = {}, onChange, onSave, saving }) => {
  const features = [
    {
      key: "premiumSubscriptions",
      title: "Premium Subscriptions",
      description: "Allow users to subscribe to Tantha Premium plans.",
      icon: Crown,
    },
    {
      key: "coffeeSupport",
      title: "Buy Me a Coffee",
      description: "Allow fans to support artists through one-time payments.",
      icon: Coffee,
    },
    {
      key: "fanClub",
      title: "Fan Club",
      description: "Enable exclusive monthly fan club subscriptions.",
      icon: HeartHandshake,
    },
    {
      key: "artistUploads",
      title: "Artist Uploads",
      description: "Allow verified artists to upload songs from their panel.",
      icon: Music2,
    },
    {
      key: "publicStreaming",
      title: "Public Streaming",
      description: "Allow public users to stream published songs.",
      icon: Radio,
    },
    {
      key: "analyticsTracking",
      title: "Analytics Tracking",
      description: "Track plays, likes, streams, earnings, and user activity.",
      icon: BarChart3,
    },
    {
      key: "userRegistration",
      title: "User Registration",
      description: "Allow new users to create Tantha Music accounts.",
      icon: Users,
    },
    {
      key: "adminApprovalFlow",
      title: "Admin Approval Flow",
      description: "Require admin approval before songs are published.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold text-white">Feature Toggles</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Enable or disable major platform features across Tantha Music.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          const enabled = Boolean(settings[feature.key]);

          return (
            <div
              key={feature.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onChange(feature.key, !enabled)}
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

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Feature Settings"}
        </Button>
      </div>
    </div>
  );
};

export default FeatureToggle;
