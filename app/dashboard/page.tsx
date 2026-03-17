"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import StatCard from "@/components/common/StatCard";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { DashboardAnalytics, ManagerAnalytics } from "@/types/analytics";

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function DashboardPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [adminData, setAdminData] = useState<DashboardAnalytics | null>(null);
  const [managerData, setManagerData] = useState<ManagerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const res = await api.get<DashboardAnalytics>("/analytics/dashboard");
        setAdminData(res.data);
        setManagerData(null);
      } else {
        const res = await api.get<ManagerAnalytics>("/analytics/me");
        setManagerData(res.data);
        setAdminData(null);
      }
    } catch (error) {
      console.error("Dashboard yuklashda xatolik:", error);
      setAdminData(null);
      setManagerData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Dashboard"
          subtitle={isAdmin ? "Admin boshqaruv paneli" : "Manager boshqaruv paneli"}
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : null}

        {!loading && isAdmin && adminData ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Jami foydalanuvchilar"
                value={adminData.users.total}
                subtitle={`Admin: ${adminData.users.admins} | Manager: ${adminData.users.managers}`}
              />
              <StatCard
                title="Jami to‘lovlar"
                value={adminData.payments.totalCount}
                subtitle={`Bugun: ${adminData.payments.todayCount}`}
              />
              <StatCard
                title="Jami kassa"
                value={moneyFormat(adminData.payments.totalCash)}
                subtitle={`Bugungi kassa: ${moneyFormat(adminData.payments.todayCash)}`}
              />
              <StatCard
                title="Jami qarzdorlik"
                value={moneyFormat(adminData.payments.totalDebt)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Bugungi attendance"
                value={adminData.attendance.todayCount}
                subtitle={`Keldi: ${adminData.attendance.checkedInCount} | Ketdi: ${adminData.attendance.checkedOutCount}`}
              />
              <StatCard
                title="Kechikkanlar"
                value={adminData.attendance.lateCount}
              />
              <StatCard
                title="Oylik planlar"
                value={adminData.plans.monthlyPlansCount}
                subtitle={`Reja kassa: ${moneyFormat(adminData.plans.monthlyPlanCash)}`}
              />
              <StatCard
                title="Oylik fact kassa"
                value={moneyFormat(adminData.plans.monthlyFactCash)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <StatCard
                title="Jarimalar soni"
                value={adminData.penalties.totalCount}
              />
              <StatCard
                title="Jarimalar summasi"
                value={moneyFormat(adminData.penalties.totalAmount)}
              />
            </div>
<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Lidlar statistikasi
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Lidlar bo‘yicha umumiy ko‘rsatkichlar
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Bugun
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Haftalik
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Oylik
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard
                  title="today yangi lid"
                  value={adminData.leads.today}
                />
                <StatCard
                  title="Ishga olindi"
                  value={adminData.leads.ishgaOlindi}
                />
                <StatCard
                  title="Aloqa o‘rnatildi"
                  value={adminData.leads.aloqa}
                />
                <StatCard
                  title="Konsultatsiya berildi"
                  value={adminData.leads.konsultatsiya}
                />
                <StatCard
                  title="Qiziqish bildirdi"
                  value={adminData.leads.qiziqish}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard
                  title="Hisob yuborildi"
                  value={adminData.leads.hisob}
                />
                <StatCard
                  title="Pre-daplata"
                  value={adminData.leads.pre}
                />
                <StatCard
                  title="To‘liq to‘lov"
                  value={adminData.leads.toliq}
                />
                <StatCard
                  title="Ko‘targan"
                  value={adminData.leads.kotargan}
                />
                <StatCard
                  title="Ko‘tarmagan"
                  value={adminData.leads.kotarmagan}
                />
              </div>
            </div>
          </>
        ) : null}

        {!loading && !isAdmin && managerData ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="To‘lovlar soni"
                value={managerData.payments.count}
              />
              <StatCard
                title="Jami kassa"
                value={moneyFormat(managerData.payments.totalCash)}
              />
              <StatCard
                title="Jami qarzdorlik"
                value={moneyFormat(managerData.payments.totalDebt)}
              />
              <StatCard
                title="Fact yozilgan kunlar"
                value={managerData.facts.count}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Jami qo‘ng‘iroq"
value={managerData.facts.factCalls}
              />
              <StatCard
                title="Jami suhbat"
                value={managerData.facts.factTalks}
              />
              <StatCard
                title="Jami sotuv"
                value={managerData.facts.factSalesCount}
              />
              <StatCard
                title="Fact total cash"
                value={moneyFormat(managerData.facts.factTotalCash)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Attendance keldi"
                value={managerData.attendance.checkedInCount}
              />
              <StatCard
                title="Attendance ketdi"
                value={managerData.attendance.checkedOutCount}
              />
              <StatCard
                title="Kechikishlar"
                value={managerData.attendance.lateCount}
              />
              <StatCard
                title="Jarimalar summasi"
                value={moneyFormat(managerData.penalties.totalAmount)}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Oylik plan ma’lumoti
              </h3>

              {managerData.monthlyPlan ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-500">Plan qo‘ng‘iroq</p>
                    <p className="mt-1 font-semibold">
                      {managerData.monthlyPlan.planCalls}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Plan suhbat</p>
                    <p className="mt-1 font-semibold">
                      {managerData.monthlyPlan.planTalks}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Plan sotuv</p>
                    <p className="mt-1 font-semibold">
                      {managerData.monthlyPlan.planSalesCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Plan total cash</p>
                    <p className="mt-1 font-semibold">
                      {moneyFormat(managerData.monthlyPlan.planTotalCash)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Mukofot</p>
                    <p className="mt-1 font-semibold">
                      {managerData.monthlyPlan.rewardName || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">So‘z narxi vazifa</p>
                    <p className="mt-1 font-semibold">
                      {managerData.monthlyPlan.penaltyTask || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-slate-500">
                  Bu oy uchun plan topilmadi.
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}