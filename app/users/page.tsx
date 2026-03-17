"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import StatCard from "@/components/common/StatCard";
import UserFormModal from "@/components/forms/UserFormModal";
import UsersTable from "@/components/tables/UsersTable";
import { api } from "@/lib/api";
import { UserItem } from "@/types/user";

export default function UsersPage() {
  const [rows, setRows] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const res = await api.get<UserItem[]>("/users");
      setRows(res.data);
    } catch (error) {
      console.error("Users yuklashda xatolik:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Rostan ham foydalanuvchini o‘chirmoqchimisiz?");
    if (!ok) return;

    await api.delete(`/users/${id}`);
    fetchRows();
  };

  const totalUsers = rows.length;
  const totalAdmins = rows.filter((item) => item.role === "admin").length;
  const totalManagers = rows.filter((item) => item.role === "manager").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Foydalanuvchilar"
          subtitle="Admin va managerlarni boshqarish"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard title="Jami foydalanuvchilar" value={totalUsers} />
          <StatCard title="Adminlar" value={totalAdmins} />
          <StatCard title="Managerlar" value={totalManagers} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex justify-end">
            <PrimaryButton type="button" onClick={() => setModalOpen(true)}>
              Manager qo‘shish
            </PrimaryButton>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : (
          <UsersTable rows={rows} onDelete={handleDelete} />
        )}

        <UserFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchRows}
        />
      </div>
    </MainLayout>
  );
}