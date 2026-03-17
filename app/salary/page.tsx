 "use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import SalarySummaryCard from "@/components/common/SalarySummaryCard";
import SalaryTable from "@/components/tables/SalaryTable";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { SalaryAllItem, SalaryMeResponse } from "@/types/salary";

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function SalaryPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const [mySalary, setMySalary] = useState<SalaryMeResponse | null>(null);
  const [allSalaries, setAllSalaries] = useState<SalaryAllItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const res = await api.get<SalaryAllItem[]>(
          `/salary/all?month=${month}&year=${year}`
        );
        setAllSalaries(res.data);
      } else {
        const res = await api.get<SalaryMeResponse>(
          `/salary/me?month=${month}&year=${year}`
        );
        setMySalary(res.data);
      }
    } catch (error) {
      console.error("Oylikni olishda xatolik:", error);
      if (isAdmin) setAllSalaries([]);
      else setMySalary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const totalJami = allSalaries.reduce(
    (sum, item) => sum + Number(item.jami || 0),
    0
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Oylik"
          subtitle="Managerlarning oylik hisoboti"
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Oy</label>
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Yil</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : null}

        {!loading && isAdmin ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SalarySummaryCard
                title="Managerlar soni"
                value={allSalaries.length}
              />
              <SalarySummaryCard
                title="Jami oylik"
                value={moneyFormat(totalJami)}
              />
              <SalarySummaryCard
                title="Top manager"
                value={allSalaries[0]?.manager?.fullName || "-"}
              />
              <SalarySummaryCard
                title="Top summa"
                value={moneyFormat(Number(allSalaries[0]?.jami || 0))}
              />
            </div>

            <SalaryTable rows={allSalaries} />
          </>
        ) : null}
 {!loading && !isAdmin && mySalary ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SalarySummaryCard
                title="Umumiy foiz"
                value={`${mySalary.overallPercent}%`}
              />
              <SalarySummaryCard
                title="Kassaga tushgan pul"
                value={moneyFormat(mySalary.kassagaTushganPul)}
              />
              <SalarySummaryCard
                title="Foiz stavka"
                value={`${mySalary.foizStavka * 100}%`}
              />
              <SalarySummaryCard
                title="Jami oylik"
                value={moneyFormat(mySalary.jami)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <SalarySummaryCard
                title="% hisobidan pul"
                value={moneyFormat(mySalary.oylikPercentMoney)}
              />
              <SalarySummaryCard
                title="Konversiya bonusi"
                value={moneyFormat(mySalary.conversionBonus)}
              />
              <SalarySummaryCard
                title="Task bonus"
                value={moneyFormat(mySalary.monthlyTaskBonus)}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Qo‘shimcha ma’lumot
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-sm text-slate-500">Mukofot</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {mySalary.rewardName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Mukofot statusi</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {mySalary.rewardStatus}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">So‘z narxi</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {mySalary.penaltyTask || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">So‘z narxi statusi</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {mySalary.penaltyTaskStatus}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}