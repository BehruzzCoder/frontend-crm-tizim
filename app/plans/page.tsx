 "use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { MonthlyPlan, DashboardProgress } from "@/types/plan";
import MonthlyPlanFormModal from "@/components/forms/MonthlyPlanFormModal";
import DailyFactFormModal from "@/components/forms/DailyFactFormModal";

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function PlansPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [selectedManagerId, setSelectedManagerId] = useState<string>(
    user?.role === "manager" ? String(user.id) : ""
  );

  const [managers, setManagers] = useState<any[]>([]);
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan | null>(null);
  const [progress, setProgress] = useState<DashboardProgress | null>(null);

  const [loading, setLoading] = useState(true);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [factModalOpen, setFactModalOpen] = useState(false);

  const fetchManagers = async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/users/managers");
      setManagers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Managerlarni olishda xatolik:", error);
      setManagers([]);
    }
  };

const fetchMonthlyPlan = async (managerId: string) => {
  try {
    if (isAdmin) {
      if (!managerId) {
        setMonthlyPlan(null);
        return;
      }

      const res = await api.get<MonthlyPlan[]>(
        `/monthly-plans?userId=${managerId}&month=${currentMonth}&year=${currentYear}`
      );

      const rows = Array.isArray(res.data) ? res.data : [];
      setMonthlyPlan(rows.length ? rows[0] : null);
    } else {
      const res = await api.get<MonthlyPlan[]>(
        `/monthly-plans/me?month=${currentMonth}&year=${currentYear}`
      );

      const rows = Array.isArray(res.data) ? res.data : [];
      setMonthlyPlan(rows.length ? rows[0] : null);
    }
  } catch (error) {
    console.error("Oylik planni olishda xatolik:", error);
    setMonthlyPlan(null);
  }
};

  const fetchData = async () => {
    try {
      setLoading(true);

      if (isAdmin && !selectedManagerId) {
        setMonthlyPlan(null);
        setProgress(null);
        return;
      }

      await Promise.all([
        fetchMonthlyPlan(selectedManagerId),
        setProgress(selectedManagerId),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedManagerId]);

  const activeManagerName =
    isAdmin
      ? managers.find((m) => String(m.id) === selectedManagerId)?.fullName || "-"
      : user?.fullName || "-";

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Plan / Fakt"
          subtitle="Oylik plan, kunlik fakt va progress"
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-md">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Foydalanuvchi
              </label>
 {isAdmin ? (
                <select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                >
                  <option value="">Manager tanlang</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.fullName}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-900">
                  {activeManagerName}
                </div>
              )}
            </div>

            <div>
              <PrimaryButton type="button" onClick={() => setPlanModalOpen(true)}>
                Oylik plan yozish
              </PrimaryButton>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : null}

        {!loading && progress ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Kunlik progress</h3>
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                  {progress.daily.overallPercent}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Qo‘ng‘iroq</p>
                  <p>Plan: {progress.daily.plan.planCalls}</p>
                  <p>Fakt: {progress.daily.fact.factCalls}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Suhbat</p>
                  <p>Plan: {progress.daily.plan.planTalks}</p>
                  <p>Fakt: {progress.daily.fact.factTalks}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Sotuv</p>
                  <p>Plan: {progress.daily.plan.planSalesCount}</p>
                  <p>Fakt: {progress.daily.fact.factSalesCount}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Kassa</p>
                  <p>Plan: {moneyFormat(progress.daily.plan.planTotalCash)}</p>
                  <p>Fakt: {moneyFormat(progress.daily.fact.factTotalCash)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Haftalik progress</h3>
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                  {progress.weekly.overallPercent}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Qo‘ng‘iroq</p>
                  <p>Plan: {progress.weekly.plan.planCalls}</p>
                  <p>Fakt: {progress.weekly.fact.factCalls}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
 <p className="font-medium">Suhbat</p>
                  <p>Plan: {progress.weekly.plan.planTalks}</p>
                  <p>Fakt: {progress.weekly.fact.factTalks}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Sotuv</p>
                  <p>Plan: {progress.weekly.plan.planSalesCount}</p>
                  <p>Fakt: {progress.weekly.fact.factSalesCount}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Kassa</p>
                  <p>Plan: {moneyFormat(progress.weekly.plan.planTotalCash)}</p>
                  <p>Fakt: {moneyFormat(progress.weekly.fact.factTotalCash)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Oylik progress</h3>
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                  {progress.monthly.overallPercent}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Qo‘ng‘iroq</p>
                  <p>Plan: {progress.monthly.plan.planCalls}</p>
                  <p>Fakt: {progress.monthly.fact.factCalls}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Suhbat</p>
                  <p>Plan: {progress.monthly.plan.planTalks}</p>
                  <p>Fakt: {progress.monthly.fact.factTalks}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Sotuv</p>
                  <p>Plan: {progress.monthly.plan.planSalesCount}</p>
                  <p>Fakt: {progress.monthly.fact.factSalesCount}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium">Kassa</p>
                  <p>Plan: {moneyFormat(progress.monthly.plan.planTotalCash)}</p>
                  <p>Fakt: {moneyFormat(progress.monthly.fact.factTotalCash)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">Oy/Yil</th>
                <th className="px-4 py-3 text-left">Qo‘ng‘iroq</th>
                <th className="px-4 py-3 text-left">Suhbat</th>
                <th className="px-4 py-3 text-left">Sotuv</th>
                <th className="px-4 py-3 text-left">Umumiy kassa</th>
                <th className="px-4 py-3 text-left">Mukofot</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {monthlyPlan ? (
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {monthlyPlan.month}/{monthlyPlan.year}
                  </td>
                  <td className="px-4 py-3">{monthlyPlan.planCalls}</td>
                  <td className="px-4 py-3">{monthlyPlan.planTalks}</td>
                  <td className="px-4 py-3">{monthlyPlan.planSalesCount}</td>
                  <td className="px-4 py-3">
                    {moneyFormat(monthlyPlan.planTotalCash)}
                  </td>
                  <td className="px-4 py-3">{monthlyPlan.rewardName || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setFactModalOpen(true)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Fakt yozish
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    Oylik plan topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <MonthlyPlanFormModal
          open={planModalOpen}
          onClose={() => setPlanModalOpen(false)}
          onSuccess={fetchData}
          userId={selectedManagerId}
          month={currentMonth}
          year={currentYear}
        />

        <DailyFactFormModal
          open={factModalOpen}
          onClose={() => setFactModalOpen(false)}
          onSuccess={fetchData}
          monthlyPlan={monthlyPlan}
        />
      </div>
    </MainLayout>
  );
}