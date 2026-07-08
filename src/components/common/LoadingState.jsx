function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-12">
      <div className="flex items-center gap-3 text-sm text-white/50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-pink-500" />
        {message}
      </div>
    </div>
  );
}

export default LoadingState;
