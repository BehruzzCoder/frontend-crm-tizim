 "use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import PaymentFormModal from "@/components/forms/PaymentFormModal";
import PaymentsTable from "@/components/tables/PaymentsTable";
import { api } from "@/lib/api";
import { Payment } from "@/types/payment";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get<Payment[]>("/payments");
      setPayments(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchPayments();
      return;
    }

    try {
      setLoading(true);
      const res = await api.get<Payment[]>(`/payments/search?q=${search}`);
      setPayments(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/payments/${id}`);
    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="To‘lovlar"
          subtitle="To‘lov qilgan lidlar, qarzdorlik va cheklarni boshqaring"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Jami to‘lovlar</p>
            <h3 className="mt-2 text-2xl font-bold">{payments.length}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Qarzi yo‘q</p>
            <h3 className="mt-2 text-2xl font-bold text-green-600">
              {payments.filter((p) => Number(p.debt) === 0).length}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Qarzdorlar</p>
            <h3 className="mt-2 text-2xl font-bold text-red-600">
              {payments.filter((p) => Number(p.debt) > 0).length}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <TextInput
                label="Qidirish"
                placeholder="Ism yoki telefon"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton type="button" onClick={handleSearch}>
                Qidirish
              </PrimaryButton>

              <button
                onClick={fetchPayments}
                className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700"
              >
                Reset
              </button>

              <PrimaryButton
                type="button"
                onClick={() => {
                  setEditPayment(null);
                  setModalOpen(true);
                }}
              >
                To‘lov qo‘shish
              </PrimaryButton>
            </div>
          </div>
        </div>
 {loading ? (
          <div className="text-slate-500">Yuklanmoqda...</div>
        ) : (
          <PaymentsTable
            payments={payments}
            onEdit={(payment) => {
              setEditPayment(payment);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

        <PaymentFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditPayment(null);
          }}
          onSuccess={fetchPayments}
          editData={editPayment}
        />
      </div>
    </MainLayout>
  );
}