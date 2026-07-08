import { HeartHandshake } from "lucide-react";

const FanClubTable = ({ memberships = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">
        Fan Club Memberships
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase text-zinc-500">
              <th className="pb-3 font-medium">Member</th>
              <th className="pb-3 font-medium">Artist</th>
              <th className="pb-3 font-medium">Plan</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Joined</th>
            </tr>
          </thead>

          <tbody>
            {memberships.length > 0 ? (
              memberships.map((member) => (
                <tr key={member._id} className="border-b border-white/5">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
                        <HeartHandshake size={18} />
                      </div>

                      <span className="font-medium text-white">
                        {member.userName || "Unknown User"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-zinc-400">
                    {member.artistName || "Unknown Artist"}
                  </td>

                  <td className="py-4 text-zinc-300">
                    {member.plan || "Monthly"}
                  </td>

                  <td className="py-4 font-medium text-emerald-400">
                    ₹{member.amount || 0}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        member.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {member.status || "Inactive"}
                    </span>
                  </td>

                  <td className="py-4 text-zinc-500">
                    {member.joinedAt || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-10 text-center text-zinc-500">
                  No fan club memberships found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FanClubTable;
