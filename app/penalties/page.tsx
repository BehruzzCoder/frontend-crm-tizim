"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import PenaltyFormModal from "@/components/forms/PenaltyFormModal";
import PenaltiesTable from "@/components/forms/PenaltiesTable";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Penalty } from "@/types/penalty";

export default function PenaltiesPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [rows, setRows] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPenalty, setEditPenalty] = useState<Penalty | null>(null);

  const fetchRows = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const res = await api.get<Penalty[]>("/penalties");
        setRows(res.data);
      } else {
        const res = await api.get<Penalty[]>("/penalties/me");
        setRows(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Rostan ham so‘z narxini o‘chirmoqchimisiz?");
    if (!ok) return;

    await api.delete(`/penalties/${id}`);
    fetchRows();
  };

  useEffect(() => {
    fetchRows();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="So‘z narxlari"
          subtitle="Managerlarga qo‘yilgan so‘z narxilar va nazorat"
        />

        {isAdmin ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex justify-end">
              <PrimaryButton
                type="button"
                onClick={() => {
                  setEditPenalty(null);
                  setModalOpen(true);
                }}
              >
                So‘z narxi qo‘shish
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="text-slate-500">Yuklanmoqda...</div>
        ) : (
          <PenaltiesTable
            rows={rows}
            onEdit={(item) => {
              setEditPenalty(item);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

        <PenaltyFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditPenalty(null);
          }}
          onSuccess={fetchRows}
          editData={editPenalty}
        />
      </div>
    </MainLayout>
  );
}