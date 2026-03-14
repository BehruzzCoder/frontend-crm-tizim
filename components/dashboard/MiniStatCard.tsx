interface Props {
  title: string;
  value: number | string;
}

export default function MiniStatCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
      <p className="text-xs text-slate-500">{title}</p>
      <h4 className="mt-2 text-xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}