import { RatingItem } from "@/types/rating";

interface LeaderboardTopCardProps {
  item: RatingItem;
}

function getStyles(rank: number) {
  if (rank === 1) {
    return {
      badge: "🥇",
      card: "border-yellow-300 bg-yellow-50",
      amount: "text-yellow-700",
      rankBg: "bg-yellow-100 text-yellow-700",
    };
  }

  if (rank === 2) {
    return {
      badge: "🥈",
      card: "border-slate-300 bg-slate-50",
      amount: "text-slate-700",
      rankBg: "bg-slate-200 text-slate-700",
    };
  }

  return {
    badge: "🥉",
    card: "border-orange-300 bg-orange-50",
    amount: "text-orange-700",
    rankBg: "bg-orange-100 text-orange-700",
  };
}

export default function LeaderboardTopCard({
  item,
}: LeaderboardTopCardProps) {
  const styles = getStyles(item.rank);

  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${styles.card}`}
    >
      <div className="flex items-start justify-between">
        <div className="text-4xl">{styles.badge}</div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles.rankBg}`}
        >
          {item.rank}-o‘rin
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-slate-900">
          {item.manager.fullName}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{item.manager.login}</p>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-500">Kassaga tushgan pul</p>
        <h4 className={`mt-2 text-3xl font-extrabold ${styles.amount}`}>
          {Number(item.totalCash).toLocaleString("ru-RU")}
        </h4>
      </div>
    </div>
  );
}