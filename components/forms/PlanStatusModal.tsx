"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { Plan } from "@/types/plan";

interface PlanStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: Plan | null;
}

export default function PlanStatusModal({
  open,
  onClose,
  onSuccess,
  plan,
}: PlanStatusModalProps) {
  const [rewardStatus, setRewardStatus] = useState("pending");
  const [penaltyTaskStatus, setPenaltyTaskStatus] = useState("pending");
  const [adminComment, setAdminComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setRewardStatus(plan.rewardStatus || "pending");
      setPenaltyTaskStatus(plan.penaltyTaskStatus || "pending" );
      setAdminComment(plan.adminComment || "");
    }
  }, [plan, open]);

  const handleSubmit = async () => {
    if (!plan) return;

    try {
      setLoading(true);

      await api.put(`/plans/${plan.id}/statuses`, {
        rewardStatus,
        penaltyTaskStatus,
        adminComment,
      });

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Plan statuslarini yangilash">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Reward status
          </label>
          <select
            value={rewardStatus}
            onChange={(e) => setRewardStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          >
            <option value="pending">pending</option>
            <option value="given">given</option>
            <option value="not_given">not_given</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Penalty task status
          </label>
          <select
            value={penaltyTaskStatus}
            onChange={(e) => setPenaltyTaskStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          >
            <option value="pending">pending</option>
            <option value="done">done</option>
            <option value="not_done">not_done</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Admin comment
          </label>
          <textarea
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            className="min-h-[120px] w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700"
          >
            Bekor qilish
          </button>

          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Saqlanmoqda..." : "Status saqlash"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}