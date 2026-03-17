import { ProgressBlock } from "@/types/plan";

interface ProgressCardProps {
  title: string;
  data: ProgressBlock;
}

function formatMoney(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function ProgressCard({ title, data }: ProgressCardProps) {
  const badgeClass =
    Number(data.overallPercent) >= 100
      ? "bg-green-100 text-green-700"
      : Number(data.overallPercent) >= 70
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>
          {data.overallPercent}%
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Metric title="Qo‘ng‘iroq" plan={data.plan.planCalls} fact={data.fact.factCalls} percent={data.percent.callsPercent} />
        <Metric title="Suhbat" plan={data.plan.planTalks} fact={data.fact.factTalks} percent={data.percent.talksPercent} />
        <Metric title="Sotuv soni" plan={data.plan.planSalesCount} fact={data.fact.factSalesCount} percent={data.percent.salesCountPercent} />
        <Metric title="Kassa" plan={data.plan.planTotalCash} fact={data.fact.factTotalCash} percent={data.percent.totalCashPercent} money />
      </div>
    </div>
  );
}

function Metric({
  title,
  plan,
  fact,
  percent,
  money = false,
}: {
  title: string;
  plan: number;
  fact: number;
  percent: number;
  money?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-2 space-y-1 text-sm">
        <p className="text-slate-700">
          Plan: <span className="font-semibold">{money ? formatMoney(plan) : plan}</span>
        </p>
        <p className="text-slate-700">
          Fakt: <span className="font-semibold">{money ? formatMoney(fact) : fact}</span>
        </p>
        <p className="text-slate-700">
          Foiz: <span className="font-semibold">{percent}%</span>
        </p>
      </div>
    </div>
  );
}