import { Crown } from "lucide-react";

const PremiumTable = ({ subscribers = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">
        Premium Subscribers
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase text-zinc-500">
              <th className="pb-3 font-medium">Subscriber</th>
              <th className="pb-3 font-medium">Plan</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Renewal Date</th>
              <th className="pb-3 font-medium">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="border-b border-white/5">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                        <Crown size={18} />
                      </div>

                      <span className="font-medium text-white">
                        {subscriber.name ||
                          subscriber.userName ||
                          "Unknown User"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-zinc-300">
                    {subscriber.plan || "Monthly"}
                  </td>

                  <td className="py-4 font-medium text-emerald-400">
                    ₹{subscriber.amount || 0}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        subscriber.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {subscriber.status || "Inactive"}
                    </span>
                  </td>

                  <td className="py-4 text-zinc-400">
                    {subscriber.renewalDate || "—"}
                  </td>

                  <td className="py-4 font-semibold text-white">
                    ₹{subscriber.revenue || subscriber.amount || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-10 text-center text-zinc-500">
                  No premium subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PremiumTable;
