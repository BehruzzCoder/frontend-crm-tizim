"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface AttendanceCheckOutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AttendanceCheckOutModal({
  open,
  onClose,
  onSuccess,
}: AttendanceCheckOutModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async () => {
    const user = getUser();

    if (!user) {
      setErrorText("User topilmadi");
      return;
    }

    if (!imageFile) {
      setErrorText("Rasm tanlang");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");

      const formData = new FormData();
      formData.append("userId", String(user.id));
      formData.append("image", imageFile);

      await api.post("/attendance/check-out", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess();
      onClose();
      setImageFile(null);
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Check-out qilishda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ketdim">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Ketganlik rasmi
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
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
            {loading ? "Yuborilmoqda..." : "Ketdim"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}