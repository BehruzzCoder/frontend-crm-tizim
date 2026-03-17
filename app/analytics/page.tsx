 "use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import StatCard from "@/components/common/StatCard";
import { api } from "@/lib/api";
import { DashboardAnalytics, ManagerAnalytics } from "@/types/analytics";

interface ManagerUser {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function AnalyticsPage() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null);
  const [managerAnalytics, setManagerAnalytics] = useState<ManagerAnalytics | null>(null);
  const [managers, setManagers] = useState<ManagerUser[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchManagers = async () => {
    try {
      const res = await api.get<ManagerUser[]>("/users/managers");
      setManagers(res.data);
    } catch {
      setManagers([]);
    }
  };

  const fetchDashboard = async () => {
    const res = await api.get<DashboardAnalytics>(
      `/analytics/dashboard?month=${month}&year=${year}`
    );
    setDashboard(res.data);
  };

  const fetchManagerAnalytics = async (managerId: string) => {
    if (!managerId) {
      setManagerAnalytics(null);
      return;
    }

    const res = await api.get<ManagerAnalytics>(
      `/analytics/manager/${managerId}?month=${month}&year=${year}`
    );
    setManagerAnalytics(res.data);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDashboard(),
        fetchManagerAnalytics(selectedManagerId),
      ]);
    } catch (error) {
      console.error("Analytics yuklashda xatolik:", error);
      setDashboard(null);
      setManagerAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [month, year, selectedManagerId]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Analytics"
          subtitle="Umumiy statistika va manager kesimida tahlil"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Manager tanlash
              </label>
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
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : null}

        {!loading && dashboard ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Jami foydalanuvchilar"
                value={dashboard.users.total}
                subtitle={`Admin: ${dashboard.users.admins} | Manager: ${dashboard.users.managers}`}
              />
              <StatCard
                title="Jami to‘lovlar"
                value={dashboard.payments.totalCount}
                subtitle={`Bugun: ${dashboard.payments.todayCount}`}
              />
              <StatCard
                title="Jami kassa"
                value={moneyFormat(dashboard.payments.totalCash)}
                subtitle={`Bugungi kassa: ${moneyFormat(dashboard.payments.todayCash)}`}
              />
              <StatCard
                title="Jami qarzdorlik"
                value={moneyFormat(dashboard.payments.totalDebt)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Bugungi attendance"
                value={dashboard.attendance.todayCount}
                subtitle={`Keldi: ${dashboard.attendance.checkedInCount} | Ketdi: ${dashboard.attendance.checkedOutCount}`}
              />
              <StatCard
                title="Kechikkanlar"
                value={dashboard.attendance.lateCount}
              />
              <StatCard
                title="Oylik planlar"
                value={dashboard.plans.monthlyPlansCount}
                subtitle={`Plan kassa: ${moneyFormat(dashboard.plans.monthlyPlanCash)}`}
              />
              <StatCard
                title="Oylik fact kassa"
                value={moneyFormat(dashboard.plans.monthlyFactCash)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <StatCard
                title="Jarimalar soni"
                value={dashboard.penalties.totalCount}
              />
              <StatCard
                title="Jarimalar summasi"
                value={moneyFormat(dashboard.penalties.totalAmount)}
              />
            </div>
          </>
        ) : null}

        {!loading && managerAnalytics ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Manager analytics
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Manager ID: {managerAnalytics.managerId}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="To‘lovlar soni"
                value={managerAnalytics.payments.count}
              />
              <StatCard
                title="Jami kassa"
                value={moneyFormat(managerAnalytics.payments.totalCash)}
              />
              <StatCard
                title="Jami qarzdorlik"
                value={moneyFormat(managerAnalytics.payments.totalDebt)}
              />
              <StatCard
                title="Fact soni"
                value={managerAnalytics.facts.count}
              />
            </div>
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Jami qo‘ng‘iroq"
                value={managerAnalytics.facts.factCalls}
              />
              <StatCard
                title="Jami suhbat"
                value={managerAnalytics.facts.factTalks}
              />
              <StatCard
                title="Jami sotuv"
                value={managerAnalytics.facts.factSalesCount}
              />
              <StatCard
                title="Fact total cash"
                value={moneyFormat(managerAnalytics.facts.factTotalCash)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Attendance keldi"
                value={managerAnalytics.attendance.checkedInCount}
              />
              <StatCard
                title="Attendance ketdi"
                value={managerAnalytics.attendance.checkedOutCount}
              />
              <StatCard
                title="Kechikishlar"
                value={managerAnalytics.attendance.lateCount}
              />
              <StatCard
                title="Jarimalar summasi"
                value={moneyFormat(managerAnalytics.penalties.totalAmount)}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Oylik plan ma’lumoti
              </h3>

              {managerAnalytics.monthlyPlan ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-500">Plan qo‘ng‘iroq</p>
                    <p className="mt-1 font-semibold">
                      {managerAnalytics.monthlyPlan.planCalls}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Plan suhbat</p>
                    <p className="mt-1 font-semibold">
                      {managerAnalytics.monthlyPlan.planTalks}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Plan sotuv</p>
                    <p className="mt-1 font-semibold">
                      {managerAnalytics.monthlyPlan.planSalesCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Plan total cash</p>
                    <p className="mt-1 font-semibold">
                      {moneyFormat(managerAnalytics.monthlyPlan.planTotalCash)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Mukofot</p>
                    <p className="mt-1 font-semibold">
                      {managerAnalytics.monthlyPlan.rewardName || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">So‘z narxi vazifa</p>
                    <p className="mt-1 font-semibold">
                      {managerAnalytics.monthlyPlan.penaltyTask || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-slate-500">Bu oy uchun plan topilmadi.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}