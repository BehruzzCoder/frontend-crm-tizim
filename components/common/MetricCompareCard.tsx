interface MetricCompareCardProps {
  label: string;
  plan: number;
  fact?: number;
  percent?: number;
  showFact: boolean;
}

export default function MetricCompareCard({
  label,
  plan,
  fact,
  percent,
  showFact,
}: MetricCompareCardProps) {
  const badgeClass =
    Number(percent) >= 100
      ? "bg-green-100 text-green-700"
      : Number(percent) >= 70
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-medium text-slate-600">{label}</h3>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Plan</span>
          <span className="font-semibold text-slate-900">
            {Number(plan).toLocaleString()}
          </span>
        </div>

        {showFact ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Fact</span>
              <span className="font-semibold text-slate-900">
                {Number(fact || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Foiz</span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
              >
                {Number(percent || 0).toFixed(2)}%
              </span>
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-400">Fact hali yozilmagan</div>
        )}
      </div>
    </div>
  );
}