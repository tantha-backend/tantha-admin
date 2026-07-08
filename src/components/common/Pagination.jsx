import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
      <p className="text-sm text-white/40">
        Page <span className="text-white">{page}</span> of{" "}
        <span className="text-white">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
