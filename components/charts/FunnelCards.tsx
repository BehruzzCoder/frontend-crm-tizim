interface Props {
  data: {
    jamiLid: number;
    ishgaOlindi: number;
    aloqaOrnatildi: number;
    konsultatsiyaBerildi: number;
    qiziqishBildirdi: number;
    hisobRaqamYuborildi: number;
    preDaplata: number;
    toliqTolov: number;
  };
}

export default function FunnelCards({ data }: Props) {
  const items = [
    { label: "Jami lid", value: data.jamiLid },
    { label: "Ishga olindi", value: data.ishgaOlindi },
    { label: "Aloqa o‘rnatildi", value: data.aloqaOrnatildi },
    { label: "Konsultatsiya", value: data.konsultatsiyaBerildi },
    { label: "Qiziqish", value: data.qiziqishBildirdi },
    { label: "Hisob raqam", value: data.hisobRaqamYuborildi },
    { label: "Pre-daplata", value: data.preDaplata },
    { label: "To‘liq to‘lov", value: data.toliqTolov },
  ];

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Funnel
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 p-4 bg-slate-50"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}