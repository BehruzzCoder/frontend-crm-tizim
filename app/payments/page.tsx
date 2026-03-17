"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import StatCard from "@/components/common/StatCard";
import PaymentFormModal from "@/components/forms/PaymentFormModal";
import PaymentsTable from "@/components/tables/PaymentsTable";
import { api } from "@/lib/api";
import { Payment } from "@/types/payment";

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function PaymentsPage() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const res = await api.get<Payment[]>("/payments");
      setRows(res.data);
    } catch (error) {
      console.error("To‘lovlarni olishda xatolik:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Rostan ham to‘lovni o‘chirmoqchimisiz?");
    if (!ok) return;

    await api.delete(`/payments/${id}`);
    fetchRows();
  };

  const handleGiveBonus = async (id: number) => {
    await api.post(`/payments/bonus/${id}`);
    fetchRows();
  };

  const totalCash = rows.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalDebt = rows.reduce((sum, item) => sum + Number(item.debt), 0);
  const bonusGivenCount = rows.filter((item) => item.bonusGiven).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="To‘lovlar"
          subtitle="Managerlar kesimida barcha to‘lovlar"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Jami to‘lovlar" value={rows.length} />
          <StatCard title="Jami kassa" value={moneyFormat(totalCash)} />
          <StatCard title="Jami qarzdorlik" value={moneyFormat(totalDebt)} />
          <StatCard title="Bonus berilganlar" value={bonusGivenCount} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex justify-end">
            <PrimaryButton type="button" onClick={() => setModalOpen(true)}>
              To‘lov qo‘shish
            </PrimaryButton>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : (
          <PaymentsTable
            rows={rows}
            onDelete={handleDelete}
            onGiveBonus={handleGiveBonus}
          />
        )}

        <PaymentFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchRows}
        />
      </div>
    </MainLayout>
  );
}