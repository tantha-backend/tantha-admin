import {
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  Crown,
  HeartHandshake,
} from "lucide-react";

const transactionIcons = {
  premium: Crown,
  coffee: Coffee,
  fanclub: HeartHandshake,
};

const transactionColors = {
  premium: "bg-yellow-500/10 text-yellow-400",
  coffee: "bg-orange-500/10 text-orange-400",
  fanclub: "bg-pink-500/10 text-pink-400",
};

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Recent Transactions
        </h3>

        <ArrowUpRight size={18} className="text-zinc-500" />
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const Icon = transactionIcons[transaction.type] || ArrowDownLeft;

            const color =
              transactionColors[transaction.type] ||
              "bg-emerald-500/10 text-emerald-400";

            return (
              <div
                key={transaction._id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 transition hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      {transaction.title}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {transaction.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-emerald-400">
                    ₹{transaction.amount || 0}
                  </p>

                  <p className="text-xs text-zinc-500">{transaction.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10">
          <div className="text-center">
            <ArrowDownLeft size={36} className="mx-auto mb-3 text-zinc-600" />

            <p className="text-zinc-400">No recent transactions found.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
