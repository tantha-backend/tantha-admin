const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      )}

      <input
        className={`
          w-full
          rounded-xl
          border
          border-zinc-800
          bg-zinc-950
          px-4
          py-3
          text-white
          outline-none
          transition
          placeholder:text-zinc-600
          focus:border-pink-500
          ${className}
        `}
        {...props}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
