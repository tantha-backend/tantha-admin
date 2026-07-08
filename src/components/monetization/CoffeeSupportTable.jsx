import { Coffee } from "lucide-react";

const CoffeeSupportTable = ({ supports = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">Coffee Support</h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase text-zinc-500">
              <th className="pb-3 font-medium">Supporter</th>
              <th className="pb-3 font-medium">Artist</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Message</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {supports.length > 0 ? (
              supports.map((item) => (
                <tr key={item._id} className="border-b border-white/5">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                        <Coffee size={18} />
                      </div>

                      <span className="font-medium text-white">
                        {item.supporterName || item.userName || "Anonymous"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-zinc-400">
                    {item.artistName || "Unknown Artist"}
                  </td>

                  <td className="py-4 font-medium text-emerald-400">
                    ₹{item.amount || 0}
                  </td>

                  <td className="max-w-[250px] truncate py-4 text-zinc-400">
                    {item.message || "No message"}
                  </td>

                  <td className="py-4 text-zinc-500">{item.date || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-zinc-500">
                  No coffee support records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoffeeSupportTable;
