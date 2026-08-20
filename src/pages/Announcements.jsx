import { useEffect, useMemo, useState } from "react";
import { Megaphone, Send, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import Button from "../components/ui/Button";

import announcementService from "../services/announcementService";

const MAX_TITLE = 80;
const MAX_MESSAGE = 500;

const formatWhen = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

/**
 * Sends a message to everyone using the app.
 *
 * It lands in each listener's notification bell. There is no undo once sent —
 * removing an announcement afterwards takes it off the list, but anyone who
 * already opened the app has seen it — so the send is behind a confirm step.
 */
const Announcements = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await announcementService.list();
      setItems(res?.announcements || []);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const ready = useMemo(
    () => title.trim().length > 0 && message.trim().length > 0,
    [title, message],
  );

  const send = async () => {
    try {
      setSending(true);

      await announcementService.send({
        title: title.trim(),
        message: message.trim(),
      });

      toast.success("Sent to everyone");
      setTitle("");
      setMessage("");
      setConfirming(false);
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const remove = async (id) => {
    try {
      await announcementService.remove(id);
      toast.success("Removed");
      await load();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Send a message to everyone using the Tantha Music app."
      />

      <SectionCard
        title="New announcement"
        description="This appears in every listener's notifications."
      >
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-white/70">Title</label>
              <span className="text-xs text-white/40">
                {title.length}/{MAX_TITLE}
              </span>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
              placeholder="New music out now"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-white/70">Message</label>
              <span className="text-xs text-white/40">
                {message.length}/{MAX_MESSAGE}
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
              rows={4}
              placeholder="Ten new Manipuri releases just landed. Open the app to listen."
              className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500"
            />
          </div>

          {confirming ? (
            <div className="rounded-xl border border-pink-500/40 bg-pink-500/[0.05] p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-white">
                <Users size={16} /> Send this to everyone?
              </p>
              <p className="mt-1 text-xs text-white/50">
                It reaches every person using the app and can&apos;t be unsent.
              </p>

              <div className="mt-4 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setConfirming(false)}
                  disabled={sending}
                >
                  Cancel
                </Button>
                <Button onClick={send} disabled={sending}>
                  {sending ? "Sending..." : "Yes, send it"}
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setConfirming(true)} disabled={!ready}>
              <span className="flex items-center gap-2">
                <Send size={16} /> Send announcement
              </span>
            </Button>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Sent"
        description={loading ? "Loading..." : `${items.length} announcement${items.length === 1 ? "" : "s"}`}
      >
        {loading ? null : items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black p-8 text-center">
            <Megaphone className="mx-auto mb-3 text-white/30" size={34} />
            <p className="text-sm text-white/50">Nothing sent yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/40 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
                  <Megaphone size={17} className="text-pink-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/60">{item.message}</p>
                  <p className="mt-2 text-xs text-white/35">
                    {formatWhen(item.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => remove(item._id)}
                  title="Remove from the list"
                  className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default Announcements;
