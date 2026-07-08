const DataTable = ({
  columns = [],
  data = [],
  rowKey = "_id",
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
}) => {
  const allSelected = data.length > 0 && selectedRows.length === data.length;

  return (
    <div className="relative z-20 w-full overflow-visible">
      <table className="w-full min-w-[900px] border-separate border-spacing-0">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-950">
            {selectable && (
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
                />
              </th>
            )}

            {columns.map((column) => (
              <th
                key={column.header}
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500 ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            const key = row?.[rowKey] || index;
            const isSelected = selectedRows.includes(key);

            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-neutral-900 transition hover:bg-neutral-900/70 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {selectable && (
                  <td
                    className="px-4 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectRow?.(key, e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
                    />
                  </td>
                )}

                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-4 py-4 align-middle text-sm text-neutral-300 ${
                      column.cellClassName || ""
                    }`}
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
