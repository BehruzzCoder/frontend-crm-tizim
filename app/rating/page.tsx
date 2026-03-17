"use client";

import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import StatCard from "@/components/common/StatCard";
import LeaderboardTopCard from "@/components/common/LeaderboardTopCard";
import RatingTable from "@/components/tables/RatingTable";
import { api } from "@/lib/api";
import { RatingItem } from "@/types/rating";

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function RatingPage() {
  const [rows, setRows] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRating = async () => {
    try {
      setLoading(true);
      const res = await api.get<RatingItem[]>("/rating");
      setRows(res.data);
    } catch (error) {
      console.error("Reytingni olishda xatolik:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRating();
  }, []);

  const topThree = useMemo(() => rows.slice(0, 3), [rows]);
  const others = useMemo(() => rows.slice(3), [rows]);

  const totalCash = rows.reduce((sum, item) => sum + Number(item.totalCash), 0);
  const topManager = rows[0];
  const totalManagers = rows.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Reyting"
          subtitle="Managerlar kassaga tushgan pul bo‘yicha saralangan"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Jami managerlar"
            value={totalManagers}
          />
          <StatCard
            title="Jami kassa"
            value={moneyFormat(totalCash)}
          />
          <StatCard
            title="Top manager"
            value={topManager?.manager?.fullName || "-"}
            subtitle={
              topManager ? `Kassa: ${moneyFormat(topManager.totalCash)}` : ""
            }
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : null}

        {!loading && topThree.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {topThree.map((item) => (
              <LeaderboardTopCard key={item.manager.id} item={item} />
            ))}
          </div>
        ) : null}

        {!loading ? <RatingTable rows={others.length > 0 ? others : rows} /> : null}
      </div>
    </MainLayout>
  );
}