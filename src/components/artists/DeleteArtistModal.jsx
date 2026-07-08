import Button from "../ui/Button";

function DeleteArtistModal({ open, artist, loading, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Delete Artist</h2>

        <p className="mt-4 text-sm leading-6 text-white/60">
          Are you sure you want to permanently delete{" "}
          <span className="font-medium text-white">
            {artist?.stageName ||
              artist?.artistName ||
              artist?.name ||
              "this artist"}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-red-400">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete Artist"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteArtistModal;
