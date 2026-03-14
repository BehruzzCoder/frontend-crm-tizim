"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

export default function LeadsBarChart({ data }: Props) {
  const chartData = {
    labels: [
      "Jami lid",
      "Ishga olindi",
      "Aloqa o‘rnatildi",
      "Konsultatsiya",
      "Qiziqish",
      "Hisob raqam",
      "Pre-daplata",
      "To‘liq to‘lov",
    ],
    datasets: [
      {
        label: "Statistika",
        data: [
          data.jamiLid,
          data.ishgaOlindi,
          data.aloqaOrnatildi,
          data.konsultatsiyaBerildi,
          data.qiziqishBildirdi,
          data.hisobRaqamYuborildi,
          data.preDaplata,
          data.toliqTolov,
        ],
      },
    ],
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        CRM statistika grafigi
      </h2>
      <Bar data={chartData} />
    </div>
  );
}