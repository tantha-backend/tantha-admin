function FilterBar({ children, className = "" }) {
  return (
    <div
      className={`flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between ${className}`}
    >
      {children}
    </div>
  );
}

export default FilterBar;
