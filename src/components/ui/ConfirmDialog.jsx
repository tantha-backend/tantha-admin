import Button from "./Button";
import Modal from "./Modal";

const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button onClick={onCancel}>{cancelText}</Button>

          <Button
            onClick={onConfirm}
            className={
              confirmVariant === "danger" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-neutral-400 leading-7">{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;
