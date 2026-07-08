import ConfirmModal from "../common/ConfirmModal";

function DeleteAlbumModal({
  open,
  album,
  loading = false,
  onClose,
  onConfirm,
}) {
  return (
    <ConfirmModal
      open={open}
      title="Delete Album"
      description={
        album
          ? `Are you sure you want to delete "${album.title}"? This action cannot be undone.`
          : "Are you sure you want to delete this album?"
      }
      confirmText="Delete Album"
      cancelText="Cancel"
      confirmVariant="danger"
      loading={loading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default DeleteAlbumModal;
