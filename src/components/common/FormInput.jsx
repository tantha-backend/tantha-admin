function FormInput({
  label,
  error,
  className = "",
  required = false,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-white/60">
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}

      <input
        {...props}
        className={`w-full rounded-xl border bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-white/10 focus:border-pink-500"
        }`}
      />

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default FormInput;
