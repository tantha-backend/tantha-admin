import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Database,
  Mail,
  Settings as SettingsIcon,
  Shield,
  SlidersHorizontal,
  Upload,
  Wrench,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";

import GeneralSettings from "../components/settings/GeneralSettings";
import StorageSettings from "../components/settings/StorageSettings";
import FeatureToggle from "../components/settings/FeatureToggle";
import SecuritySettings from "../components/settings/SecuritySettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import EmailSettings from "../components/settings/EmailSettings";
import StreamingSettings from "../components/settings/StreamingSettings";
import UploadSettings from "../components/settings/UploadSettings";
import MaintenanceMode from "../components/settings/MaintenanceMode";

import settingsService from "../services/settingsService";

const defaultSettings = {
  general: {
    platformName: "Tantha Music",
    platformTagline: "Stream Manipuri and regional music.",
    supportEmail: "support@tanthamusic.com",
    timezone: "Asia/Kolkata",
  },
  storage: {
    provider: "AWS S3",
    bucketName: "tantha-music-uploads",
    region: "ap-south-1",
  },
  features: {
    premiumSubscriptions: true,
    coffeeSupport: true,
    fanClub: true,
    artistUploads: true,
    publicStreaming: true,
    analyticsTracking: true,
    userRegistration: true,
    adminApprovalFlow: true,
  },
  security: {
    twoFactorAuth: false,
    strongPasswordPolicy: true,
    adminLoginAlerts: true,
    deviceSessionTracking: true,
    roleBasedAccess: true,
    apiKeyProtection: true,
    adminSessionExpiry: "7 Days",
    maxLoginAttempts: 5,
    lockoutDuration: "15 Minutes",
  },
  notifications: {
    newSongUploads: true,
    newUserRegistrations: true,
    securityAlerts: true,
    systemAnnouncements: true,
    paymentNotifications: true,
    userFeedback: false,
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
  },
  email: {
    smtpHost: "smtp.tanthamusic.com",
    smtpPort: 587,
    smtpUsername: "no-reply@tanthamusic.com",
    smtpPassword: "",
    senderName: "Tantha Music",
    senderEmail: "no-reply@tanthamusic.com",
    supportEmail: "support@tanthamusic.com",
    encryption: "TLS",
  },
  streaming: {
    defaultQuality: "128 kbps",
    premiumQuality: "320 kbps",
    previewDuration: 30,
    autoplay: true,
    minimumPlaySeconds: 10,
    duplicatePlayCooldown: 60,
    trackAnonymousPlays: true,
    listeningHistory: true,
    publicStreaming: true,
    audioNormalization: true,
  },
  uploads: {
    maxAudioFileSizeMB: 50,
    maxCoverImageSizeMB: 10,
    maxSongDurationMinutes: 15,
    audioFormat: "MP3",
    coverImageFormat: "JPG / JPEG",
    compression: "Automatic",
    adminApprovalRequired: true,
    automaticAudioProcessing: true,
    automaticCoverOptimization: true,
    allowArtistUploads: true,
  },
  maintenance: {
    enabled: false,
    message:
      "Tantha Music is currently undergoing scheduled maintenance. We'll be back shortly with improvements.",
    startTime: "",
    endTime: "",
    accessMode: "Admins Only",
  },
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState("");

  const loadSettings = async () => {
    try {
      setLoading(true);

      const response = await settingsService.getSettings();
      const backendSettings = response?.settings || {};

      setSettings({
        ...defaultSettings,
        ...backendSettings,
        general: {
          ...defaultSettings.general,
          ...backendSettings.general,
        },
        storage: {
          ...defaultSettings.storage,
          ...backendSettings.storage,
        },
        features: {
          ...defaultSettings.features,
          ...backendSettings.features,
        },
        security: {
          ...defaultSettings.security,
          ...backendSettings.security,
        },
        notifications: {
          ...defaultSettings.notifications,
          ...backendSettings.notifications,
        },
        email: {
          ...defaultSettings.email,
          ...backendSettings.email,
        },
        streaming: {
          ...defaultSettings.streaming,
          ...backendSettings.streaming,
        },
        uploads: {
          ...defaultSettings.uploads,
          ...backendSettings.uploads,
        },
        maintenance: {
          ...defaultSettings.maintenance,
          ...backendSettings.maintenance,
          startTime: backendSettings.maintenance?.startTime || "",
          endTime: backendSettings.maintenance?.endTime || "",
        },
      });
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSection = (section, field, value) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const saveSection = async (section) => {
    try {
      setSavingSection(section);

      const payload = settings[section];

      const saveMap = {
        general: settingsService.updateGeneralSettings,
        storage: settingsService.updateStorageSettings,
        features: settingsService.updateFeatureSettings,
        security: settingsService.updateSecuritySettings,
        notifications: settingsService.updateNotificationSettings,
        email: settingsService.updateEmailSettings,
        streaming: settingsService.updateStreamingSettings,
        uploads: settingsService.updateUploadSettings,
        maintenance: settingsService.updateMaintenanceMode,
      };

      const saveFunction = saveMap[section];

      if (!saveFunction) {
        toast.error("Invalid settings section.");
        return;
      }

      const response = await saveFunction(payload);

      if (response?.settings) {
        setSettings((current) => ({
          ...current,
          [section]: {
            ...current[section],
            ...response.settings[section],
          },
        }));
      }

      toast.success("Settings saved successfully.");
    } catch (error) {
      console.error(`Failed to save ${section} settings:`, error);
      toast.error("Failed to save settings.");
    } finally {
      setSavingSection("");
    }
  };

  const tabs = useMemo(
    () => [
      {
        id: "general",
        label: "General",
        icon: SettingsIcon,
        component: (
          <GeneralSettings
            settings={settings.general}
            onChange={(field, value) => updateSection("general", field, value)}
            onSave={() => saveSection("general")}
            saving={savingSection === "general"}
          />
        ),
      },
      {
        id: "storage",
        label: "Storage",
        icon: Database,
        component: (
          <StorageSettings
            settings={settings.storage}
            onChange={(field, value) => updateSection("storage", field, value)}
            onSave={() => saveSection("storage")}
            saving={savingSection === "storage"}
          />
        ),
      },
      {
        id: "features",
        label: "Features",
        icon: SlidersHorizontal,
        component: (
          <FeatureToggle
            settings={settings.features}
            onChange={(field, value) => updateSection("features", field, value)}
            onSave={() => saveSection("features")}
            saving={savingSection === "features"}
          />
        ),
      },
      {
        id: "security",
        label: "Security",
        icon: Shield,
        component: (
          <SecuritySettings
            settings={settings.security}
            onChange={(field, value) => updateSection("security", field, value)}
            onSave={() => saveSection("security")}
            saving={savingSection === "security"}
          />
        ),
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        component: (
          <NotificationSettings
            settings={settings.notifications}
            onChange={(field, value) =>
              updateSection("notifications", field, value)
            }
            onSave={() => saveSection("notifications")}
            saving={savingSection === "notifications"}
          />
        ),
      },
      {
        id: "email",
        label: "Email",
        icon: Mail,
        component: (
          <EmailSettings
            settings={settings.email}
            onChange={(field, value) => updateSection("email", field, value)}
            onSave={() => saveSection("email")}
            saving={savingSection === "email"}
          />
        ),
      },
      {
        id: "streaming",
        label: "Streaming",
        icon: Zap,
        component: (
          <StreamingSettings
            settings={settings.streaming}
            onChange={(field, value) =>
              updateSection("streaming", field, value)
            }
            onSave={() => saveSection("streaming")}
            saving={savingSection === "streaming"}
          />
        ),
      },
      {
        id: "uploads",
        label: "Uploads",
        icon: Upload,
        component: (
          <UploadSettings
            settings={settings.uploads}
            onChange={(field, value) => updateSection("uploads", field, value)}
            onSave={() => saveSection("uploads")}
            saving={savingSection === "uploads"}
          />
        ),
      },
      {
        id: "maintenance",
        label: "Maintenance",
        icon: Wrench,
        component: (
          <MaintenanceMode
            settings={settings.maintenance}
            onChange={(field, value) =>
              updateSection("maintenance", field, value)
            }
            onSave={() => saveSection("maintenance")}
            saving={savingSection === "maintenance"}
          />
        ),
      },
    ],
    [settings, savingSection],
  );

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  if (loading) {
    return <LoadingState message="Loading settings..." />;
  }

  if (!settings) {
    return (
      <EmptyState
        icon={SettingsIcon}
        title="Settings unavailable"
        description="Unable to load platform settings."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage platform configuration, security, uploads, streaming, and system controls."
      />

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>{activeTabData?.component}</div>
    </div>
  );
};

export default Settings;
