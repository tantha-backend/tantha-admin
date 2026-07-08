const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-neutral-500">{label}</label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="h-10 rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-200 outline-none transition focus:border-neutral-600"
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
