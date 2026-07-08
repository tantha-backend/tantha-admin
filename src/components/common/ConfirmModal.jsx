import Button from "../ui/Button";

function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">{title}</h2>

        {description && (
          <p className="mt-3 text-sm leading-6 text-white/50">{description}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>

          <Button type="button" onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
