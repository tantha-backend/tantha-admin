import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) => {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-800 px-4 py-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-neutral-500">
        Showing <span className="text-neutral-300">{start}</span> to{" "}
        <span className="text-neutral-300">{end}</span> of{" "}
        <span className="text-neutral-300">{totalItems}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-300 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-300 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
