import { Crown, Gem, Coffee } from "lucide-react";

const ToggleButton = ({ enabled }) => {
  return (
    <div
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-all duration-200 ${
        enabled
          ? "justify-end bg-pink-600 shadow-lg shadow-pink-500/30"
          : "justify-start bg-zinc-700"
      }`}
    >
      <span className="h-4 w-4 rounded-full bg-white shadow transition-all duration-200" />
    </div>
  );
};

const OptionCard = ({ icon, title, description, enabled, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
        enabled
          ? "border-pink-500/40 bg-pink-500/10"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/80"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${
            enabled
              ? "bg-pink-500/20 text-pink-400"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="mt-1 text-xs text-zinc-400">{description}</p>
        </div>
      </div>

      <ToggleButton enabled={enabled} />
    </button>
  );
};

const MonetizationSettings = ({ formData, setFormData }) => {
  const updateField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        Access & Monetization
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Control how this song can be accessed and monetized.
      </p>

      <div className="mt-6 space-y-4">
        <OptionCard
          icon={<Gem size={18} />}
          title="Premium Song"
          description="Only premium users can stream this song."
          enabled={formData.premium}
          onClick={() => updateField("premium")}
        />

        <OptionCard
          icon={<Coffee size={18} />}
          title="Buy Me a Coffee"
          description="Allow listeners to support the artist with one-time contributions."
          enabled={formData.coffee}
          onClick={() => updateField("coffee")}
        />

        <OptionCard
          icon={<Crown size={18} />}
          title="Fan Club Exclusive"
          description="Make this song exclusive to fan club subscribers."
          enabled={formData.fanClub}
          onClick={() => updateField("fanClub")}
        />
      </div>
    </div>
  );
};

export default MonetizationSettings;
