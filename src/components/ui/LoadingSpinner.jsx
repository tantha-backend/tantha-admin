const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
        <p className="text-sm text-neutral-400">{label}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
