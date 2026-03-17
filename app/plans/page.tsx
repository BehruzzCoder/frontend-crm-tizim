"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import ProgressCard from "@/components/common/ProgressCard";
import MonthlyPlanFormModal from "@/components/forms/MonthlyPlanFormModal";
import DailyFactFormModal from "@/components/forms/DailyFactFormModal";
import MonthlyPlansTable from "@/components/tables/MonthlyPlansTable";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { DashboardProgress, MonthlyPlan } from "@/types/plan";

interface ManagerUser {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

export default function PlansPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyPlan[]>([]);
  const [progress, setProgress] = useState<DashboardProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [factModalOpen, setFactModalOpen] = useState(false);

  const [selectedMonthlyPlan, setSelectedMonthlyPlan] = useState<MonthlyPlan | null>(null);

  const [managers, setManagers] = useState<ManagerUser[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");

  const fetchManagers = async () => {
    if (!isAdmin) return;

    try {
      const res = await api.get<ManagerUser[]>("/users/managers");
      setManagers(res.data);
    } catch {
      setManagers([]);
    }
  };

  const fetchManagerPlans = async (managerId: number) => {
    const res = await api.get<MonthlyPlan[]>(`/monthly-plans/user/${managerId}`);
    setMonthlyPlans(res.data);
  };

  const fetchManagerProgress = async (managerId: number) => {
    const res = await api.get<DashboardProgress>(`/progress/user/${managerId}/dashboard`);
    setProgress(res.data);
  };

  const fetchMyData = async () => {
    const [plansRes, progressRes] = await Promise.all([
      api.get<MonthlyPlan[]>("/monthly-plans/me"),
      api.get<DashboardProgress>("/progress/me/dashboard"),
    ]);

    setMonthlyPlans(plansRes.data);
    setProgress(progressRes.data);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        if (selectedManagerId) {
          await Promise.all([
            fetchManagerPlans(Number(selectedManagerId)),
            fetchManagerProgress(Number(selectedManagerId)),
          ]);
        } else {
          setMonthlyPlans([]);
          setProgress(null);
        }
      } else {
        await fetchMyData();
      }
    } catch (error) {
      console.error("Plan/Fakt yuklashda xatolik:", error);
      setMonthlyPlans([]);
      setProgress(null);
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Plan / Fakt"
          subtitle="Oylik plan, kunlik fakt va progress"
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {isAdmin ? (
              <div className="w-full max-w-md space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Manager tanlang
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
            ) : (
              <div>
                <p className="text-sm text-slate-500">Foydalanuvchi</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {user?.fullName}
                </h3>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <PrimaryButton
                type="button"
                onClick={() => setPlanModalOpen(true)}
              >
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
            <ProgressCard title="Kunlik progress" data={progress.daily} />
            <ProgressCard title="Haftalik progress" data={progress.weekly} />
            <ProgressCard title="Oylik progress" data={progress.monthly} />
          </div>
        ) : null}

        {!loading ? (
          <MonthlyPlansTable
            rows={monthlyPlans}
            onWriteFact={(plan) => {
              setSelectedMonthlyPlan(plan);
              setFactModalOpen(true);
            }}
          />
        ) : null}

        <MonthlyPlanFormModal
          open={planModalOpen}
          onClose={() => setPlanModalOpen(false)}
          onSuccess={fetchData}
        />

        <DailyFactFormModal
          open={factModalOpen}
          onClose={() => {
            setFactModalOpen(false);
            setSelectedMonthlyPlan(null);
          }}
          onSuccess={fetchData}
          monthlyPlan={selectedMonthlyPlan}
        />
      </div>
    </MainLayout>
  );
}