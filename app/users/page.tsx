"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import UsersTable from "@/components/tables/UsersTable";
import UserFormModal from "@/components/forms/UserFormModal";
import { api } from "@/lib/api";
import { AuthUser } from "@/types/user";

type TableUser = AuthUser & {
  phone?: string;
  image?: string | null;
  isActive?: boolean;
  customStartTime?: string | null;
};

export default function UsersPage() {
  const [rows, setRows] = useState<TableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<TableUser | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<TableUser[]>("/users");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const admins = rows.filter((u) => u.role === "admin").length;
  const managers = rows.filter((u) => u.role === "manager").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Users"
          subtitle="Admin va manager userlarini boshqaring"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Jami users</p>
            <h3 className="mt-2 text-2xl font-bold">{rows.length}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Adminlar</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-600">{admins}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Managerlar</p>
            <h3 className="mt-2 text-2xl font-bold text-green-600">{managers}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex justify-end">
            <PrimaryButton
              type="button"
              onClick={() => {
                setEditUser(null);
                setModalOpen(true);
              }}
            >
              User qo‘shish
            </PrimaryButton>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500">Yuklanmoqda...</div>
        ) : (
          <UsersTable
            rows={rows}
            onEdit={(user) => {
              setEditUser(user);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

        <UserFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditUser(null);
          }}
          onSuccess={fetchUsers}
          editData={editUser}
        />
      </div>
    </MainLayout>
  );
}