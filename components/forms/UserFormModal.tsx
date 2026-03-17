"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm = {
  fullName: "",
  login: "",
  password: "",
  role: "manager",
};

export default function UserFormModal({
  open,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setErrorText("");
    }
  }, [open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      await api.post("/users", {
        fullName: form.fullName,
        login: form.login,
        password: form.password,
        role: form.role,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Manager qo‘shishda xatolik"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Yangi manager qo‘shish">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Ism familiya"
            value={form.fullName}
            onChange={(e) => setValue("fullName", e.target.value)}
          />

          <TextInput
            label="Login"
            value={form.login}
            onChange={(e) => setValue("login", e.target.value)}
          />

          <TextInput
            label="Parol"
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