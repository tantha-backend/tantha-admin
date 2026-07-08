import {
  Bell,
  CheckCircle2,
  Mail,
  MessageSquare,
  Save,
  ShieldAlert,
  Smartphone,
  UploadCloud,
  Users,
} from "lucide-react";

import Button from "../ui/Button";

const NotificationSettings = ({ settings = {}, onChange, onSave, saving }) => {
  const notificationGroups = [
    {
      key: "newSongUploads",
      title: "New Song Uploads",
      description: "Notify admins whenever artists upload new songs.",
      icon: UploadCloud,
    },
    {
      key: "newUserRegistrations",
      title: "New User Registrations",
      description: "Receive alerts when new users create an account.",
      icon: Users,
    },
    {
      key: "securityAlerts",
      title: "Security Alerts",
      description: "Receive notifications for suspicious login attempts.",
      icon: ShieldAlert,
    },
    {
      key: "systemAnnouncements",
      title: "System Announcements",
      description: "Platform maintenance and important system updates.",
      icon: Bell,
    },
    {
      key: "paymentNotifications",
      title: "Payment Notifications",
      description:
        "Premium subscriptions, Coffee Support and Fan Club payments.",
      icon: CheckCircle2,
    },
    {
      key: "userFeedback",
      title: "User Feedback",
      description: "Notify admins when users submit feedback or reports.",
      icon: MessageSquare,
    },
  ];

  const channels = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Send important alerts via email.",
      icon: Mail,
    },
    {
      key: "pushNotifications",
      title: "Push Notifications",
      description: "Send notifications directly to admin devices.",
      icon: Smartphone,
    },
    {
      key: "inAppNotifications",
      title: "In-App Notifications",
      description: "Show notifications inside the admin dashboard.",
      icon: Bell,
    },
  ];

  const Toggle = ({ field }) => {
    const enabled = Boolean(settings[field]);

    return (
      <button
        type="button"
        onClick={() => onChange(field, !enabled)}
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
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold text-white">
          Notification Settings
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Configure how administrators receive notifications from Tantha Music.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {notificationGroups.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="flex gap-4">
                <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {item.description}
                  </p>
                </div>
              </div>

              <Toggle field={item.key} />
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h3 className="text-lg font-semibold text-white">
          Notification Channels
        </h3>

        <div className="mt-6 space-y-5">
          {channels.map((channel) => {
            const Icon = channel.icon;

            return (
              <div
                key={channel.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black p-4"
              >
                <div className="flex items-center gap-4">
                  <Icon className="text-pink-400" size={20} />

                  <div>
                    <p className="text-sm font-medium text-white">
                      {channel.title}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {channel.description}
                    </p>
                  </div>
                </div>

                <Toggle field={channel.key} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
