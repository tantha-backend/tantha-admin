import { AlertTriangle, X } from "lucide-react";

import Button from "../ui/Button";

const DeleteUserModal = ({ open, user, loading, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Delete User</h2>
              <p className="mt-1 text-sm text-zinc-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black p-4">
          <p className="text-sm text-zinc-400">You are about to delete:</p>

          <p className="mt-2 font-semibold text-white">
            {user?.name || "Unnamed User"}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {user?.email || "No email"}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete User"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
