"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import RatingTable from "@/components/tables/RatingTable";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface LeadAnalytics {
  jamiLid: number;
  yangiLid: number;
  ishgaOlindi: number;
  aloqaOrnatildi: number;
  konsultatsiyaBerildi: number;
  qiziqishBildirdi: number;
  hisobRaqamYuborildi: number;
  preDaplata: number;
  toliqTolov: number;
  kotargan: number;
  kotarmagan: number;
}

interface DashboardAnalytics extends LeadAnalytics {
  paymentsCount: number;
  totalPaymentAmount: number;
  totalDebt: number;
}

interface PaymentSummary {
  paymentsCount: number;
  totalAmount: number;
  totalDebt: number;
}

interface PaymentByManager {
  manager: string;
  count: number;
  amount: number;
  debt: number;
}

const emptyLeadStats: LeadAnalytics = {
  jamiLid: 0,
  yangiLid: 0,
  ishgaOlindi: 0,
  aloqaOrnatildi: 0,
  konsultatsiyaBerildi: 0,
  qiziqishBildirdi: 0,
  hisobRaqamYuborildi: 0,
  preDaplata: 0,
  toliqTolov: 0,
  kotargan: 0,
  kotarmagan: 0,
};

const emptyDashboard: DashboardAnalytics = {
  ...emptyLeadStats,
  paymentsCount: 0,
  totalPaymentAmount: 0,
  totalDebt: 0,
};

const emptyPaymentSummary: PaymentSummary = {
  paymentsCount: 0,
  totalAmount: 0,
  totalDebt: 0,
};

type ModeType = "today" | "weekly" | "monthly";

export default function DashboardPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [dashboard, setDashboard] = useState<DashboardAnalytics>(emptyDashboard);
  const [periodStats, setPeriodStats] = useState<LeadAnalytics>(emptyLeadStats);
  const [paymentSummary, setPaymentSummary] =
    useState<PaymentSummary>(emptyPaymentSummary);
  const [ratingRows, setRatingRows] = useState<PaymentByManager[]>([]);
  const [mode, setMode] = useState<ModeType>("today");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      if (!isAdmin) {
        setLoading(false);
        return;
      }

      const [
        dashboardRes,
        todayRes,
        paymentSummaryRes,
        ratingRes,
      ] = await Promise.all([
        api.get<DashboardAnalytics>("/analytics/dashboard"),
        api.get<LeadAnalytics>("/analytics/today"),
        api.get<PaymentSummary>("/analytics/payments-summary"),
        api.get<PaymentByManager[]>("/analytics/payments-by-manager"),
      ]);

      const sortedRating = [...ratingRes.data].sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.amount - a.amount;
      });

      setDashboard(dashboardRes.data);
      setPeriodStats(todayRes.data);
      setPaymentSummary(paymentSummaryRes.data);
      setRatingRows(sortedRating);
      setMode("today");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPeriod = async (type: ModeType) => {
    try {
      setLoading(true);

      if (type === "today") {
        const res = await api.get<LeadAnalytics>("/analytics/today");
        setPeriodStats(res.data);
      } else {
        const res = await api.get<{ summary: LeadAnalytics }>(`/analytics/${type}`);
        setPeriodStats(res.data.summary);
      }

      setMode(type);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <SectionTitle
            title="Dashboard"
            subtitle="Manager panel"
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-slate-900">
              Xush kelibsiz, {user?.fullName}
            </h2>
            <p className="mt-2 text-slate-600">
              Siz attendance, plan/fact va penalties bo‘limlaridan foydalanasiz.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Dashboard"
          subtitle="Admin boshqaruv paneli"
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Lidlar statistikasi
            </h2>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton type="button" onClick={() => handleLoadPeriod("today")}>
                Bugun
              </PrimaryButton>
              <PrimaryButton type="button" onClick={() => handleLoadPeriod("weekly")}>
                Haftalik
              </PrimaryButton>
              <PrimaryButton type="button" onClick={() => handleLoadPeriod("monthly")}>
                Oylik
              </PrimaryButton>
            </div>
          </div>

          {loading ? (
            <div className="text-slate-500">Yuklanmoqda...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatCard label={`${mode} yangi lid`} value={periodStats.yangiLid} />
              <StatCard label="Ishga olindi" value={periodStats.ishgaOlindi} />
              <StatCard label="Aloqa o‘rnatildi" value={periodStats.aloqaOrnatildi} />
              <StatCard label="Konsultatsiya berildi" value={periodStats.konsultatsiyaBerildi} />
              <StatCard label="Qiziqish bildirdi" value={periodStats.qiziqishBildirdi} />
              <StatCard label="Hisob yuborildi" value={periodStats.hisobRaqamYuborildi} />
              <StatCard label="Pre-daplata" value={periodStats.preDaplata} />
              <StatCard label="To‘liq to‘lov" value={periodStats.toliqTolov} />
              <StatCard label="Ko‘targan" value={periodStats.kotargan} />
              <StatCard label="Ko‘tarmagan" value={periodStats.kotarmagan} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Jami to‘lovlar soni" value={paymentSummary.paymentsCount} />
          <StatCard
            label="Jami tushum"
            value={Number(paymentSummary.totalAmount).toLocaleString()}
          />
          <StatCard
            label="Jami qarzdorlik"
            value={Number(paymentSummary.totalDebt).toLocaleString()}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Reyting — eng ko‘p sotuv qilganlar
          </h2>
          {loading ? (
            <div className="text-slate-500">Yuklanmoqda...</div>
          ) : (
            <RatingTable rows={ratingRows} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}