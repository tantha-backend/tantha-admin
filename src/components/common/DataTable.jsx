function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  getRowKey,
}) {
  if (loading) {
    return <div className="p-12 text-center text-white/50">Loading...</div>;
  }

  if (!data.length) {
    return <div className="p-12 text-center text-white/50">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-white/10 text-left text-sm text-white/40">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 ${column.align === "right" ? "text-right" : ""}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row) : row._id || index}
              className="border-b border-white/5 hover:bg-white/[0.02]"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-5 ${column.align === "right" ? "text-right" : ""}`}
                >
                  {column.render ? column.render(row, index) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
