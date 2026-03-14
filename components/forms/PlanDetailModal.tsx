"use client";

import Modal from "@/components/common/Modal";
import MetricCompareCard from "@/components/common/MetricCompareCard";
import { Plan } from "@/types/plan";

interface PlanDetailModalProps {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export default function PlanDetailModal({
  open,
  onClose,
  plan,
}: PlanDetailModalProps) {
  if (!plan) return null;

  const showFact = plan.factWritten;

  return (
    <Modal open={open} onClose={onClose} title="Plan tafsilotlari">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Foydalanuvchi</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {plan.user?.fullName}
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">Plan turi</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {plan.type === "daily"
                  ? "Kunlik"
                  : plan.type === "weekly"
                  ? "Haftalik"
                  : "Oylik"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">Davr</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {plan.startDate}
                {plan.endDate ?  - `${plan.endDate}` : ""}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCompareCard
            label="Qo‘ng‘iroq soni"
            plan={plan.planCalls}
            fact={plan.factCalls}
            percent={plan.callsPercent}
            showFact={showFact}
          />

          <MetricCompareCard
            label="Suhbat soni"
            plan={plan.planTalks}
            fact={plan.factTalks}
            percent={plan.talksPercent}
            showFact={showFact}
          />

          <MetricCompareCard
            label="Qiziqqan mijozlar"
            plan={plan.planInterestedClients}
            fact={plan.factInterestedClients}
            percent={plan.interestedPercent}
            showFact={showFact}
          />

          <MetricCompareCard
            label="Sotuv soni"
            plan={plan.planSalesCount}
            fact={plan.factSalesCount}
            percent={plan.salesCountPercent}
            showFact={showFact}
          />

          <MetricCompareCard
            label="Kassadagi sotuv"
            plan={Number(plan.planCashSales)}
            fact={Number(plan.factCashSales)}
            percent={plan.cashSalesPercent}
            showFact={showFact}
          />

          <MetricCompareCard
            label="Shartnoma bo‘yicha sotuv"
            plan={Number(plan.planContractSales)}
            fact={Number(plan.factContractSales)}
            percent={plan.contractSalesPercent}
            showFact={showFact}
          />

          <MetricCompareCard
            label="Qarzdorlik"
            plan={Number(plan.planDebt)}
            fact={Number(plan.factDebt)}
            percent={plan.debtPercent}
            showFact={showFact}
          />

          <MetricCompareCard
            label="Umumiy kassa"
            plan={Number(plan.planTotalCash)}
            fact={Number(plan.factTotalCash)}
            percent={plan.totalCashPercent}
            showFact={showFact}
          />
        </div>

        {showFact ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Umumiy natija</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
             <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  Number(plan.overallPercent) >= 100
                    ? "bg-green-100 text-green-700"
                    : Number(plan.overallPercent) >= 70
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Umumiy foiz: {Number(plan.overallPercent).toFixed(2)}%
              </span>

              <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                Mukofot statusi: {plan.rewardStatus}
              </span>

              <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                So‘z narxi statusi: {plan.penaltyTaskStatus}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-amber-50 p-5 text-amber-700">
            Bu plan uchun hali fact yozilmagan. Hozircha faqat plan ko‘rinadi.
          </div>
        )}
      </div>
    </Modal>
  );
}