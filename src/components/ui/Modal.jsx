import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, footer, size = "md" }) => {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className={`w-full ${sizes[size]} rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 border-t border-neutral-800 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
