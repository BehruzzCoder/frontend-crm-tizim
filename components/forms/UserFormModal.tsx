"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { AuthUser, UserRole } from "@/types/user";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: (AuthUser & {
    phone?: string;
    image?: string | null;
    isActive?: boolean;
    customStartTime?: string | null;
  }) | null;
}

const initialForm = {
  fullName: "",
  phone: "",
  login: "",
  password: "",
  role: "manager" as UserRole,
  image: "",
  isActive: "true",
  customStartTime: "",
};

export default function UserFormModal({
  open,
  onClose,
  onSuccess,
  editData,
}: UserFormModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        fullName: editData.fullName || "",
        phone: editData.phone || "",
        login: editData.login || "",
        password: "",
        role: (editData.role || "manager") as UserRole,
        image: editData.image || "",
        isActive: String(editData.isActive ?? true),
        customStartTime: editData.customStartTime || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [editData, open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const payload: any = {
        fullName: form.fullName,
        phone: form.phone,
        login: form.login,
        role: form.role,
        image: form.image || null,
        isActive: form.isActive === "true",
        customStartTime: form.customStartTime || null,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (editData) {
        await api.put(`/users/${editData.id}`, payload);
      } else {
        await api.post("/users", {
          ...payload,
          password: form.password,
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "User saqlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editData ? "Userni tahrirlash" : "Yangi user qo‘shish"}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="F.I.O"
            value={form.fullName}
            onChange={(e) => setValue("fullName", e.target.value)}
          />

          <TextInput
            label="Telefon"
            value={form.phone}
            onChange={(e) => setValue("phone", e.target.value)}
          />

          <TextInput
            label="Login"
            value={form.login}
            onChange={(e) => setValue("login", e.target.value)}
          />

          <TextInput
            label={editData ? "Yangi parol (ixtiyoriy)" : "Parol"}
            type="password"
            value={form.password}
            onChange={(e) => setValue("password", e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setValue("role", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
          </div>
[3/14/26 5:49 AM] بهروز: <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Faollik</label>
            <select
              value={form.isActive}
              onChange={(e) => setValue("isActive", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="true">Faol</option>
              <option value="false">Nofaol</option>
            </select>
          </div>

          <TextInput
            label="Rasm link"
            value={form.image}
            onChange={(e) => setValue("image", e.target.value)}
          />

          <TextInput
            label="Custom start time"
            type="time"
            value={form.customStartTime}
            onChange={(e) => setValue("customStartTime", e.target.value)}
          />
        </div>

        {errorText ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorText}
          </div>
        ) : null}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700"
          >
            Bekor qilish
          </button>

          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}