 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import PlanFormModal from "@/components/forms/PlanFormModal";
import FactFormModal from "@/components/forms/FactFormModal";
import PlanStatusModal from "@/components/forms/PlanStatusModal";
import PlanDetailModal from "@/components/forms/PlanDetailModal";
import PlansTable from "@/components/tables/PlansTable";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Plan, PlanSummary } from "@/types/plan";

interface ManagerUser {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

const emptySummary: PlanSummary = {
  totalPlans: 0,
  factWrittenCount: 0,
  rewardEligibleCount: 0,
  penaltyEligibleCount: 0,
  avgOverallPercent: 0,
  totalPlanCalls: 0,
  totalFactCalls: 0,
  totalPlanTalks: 0,
  totalFactTalks: 0,
  totalPlanInterestedClients: 0,
  totalFactInterestedClients: 0,
  totalPlanSalesCount: 0,
  totalFactSalesCount: 0,
  totalPlanCashSales: 0,
  totalFactCashSales: 0,
  totalPlanContractSales: 0,
  totalFactContractSales: 0,
  totalPlanDebt: 0,
  totalFactDebt: 0,
  totalPlanTotalCash: 0,
  totalFactTotalCash: 0,
};

export default function PlansPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [rows, setRows] = useState<Plan[]>([]);
  const [summary, setSummary] = useState<PlanSummary>(emptySummary);
  const [loading, setLoading] = useState(true);

  const [managers, setManagers] = useState<ManagerUser[]>([]);
  const [managerSearch, setManagerSearch] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [factModalOpen, setFactModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const managerSearchBoxRef = useRef<HTMLDivElement | null>(null);

  const filteredManagers = useMemo(() => {
    const search = managerSearch.trim().toLowerCase();

    if (search.length < 2) return [];

    return managers.filter(
      (item) =>
        item.fullName.toLowerCase().includes(search) ||
        item.login.toLowerCase().includes(search)
    );
  }, [managers, managerSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        managerSearchBoxRef.current &&
        !managerSearchBoxRef.current.contains(event.target as Node)
      ) {
        setShowManagerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchManagers = async () => {
    if (!isAdmin) return;

    try {
      const res = await api.get<ManagerUser[]>("/users");
      const onlyManagers = res.data.filter((item) => item.role === "manager");
      setManagers(onlyManagers);
    } catch (error) {
      console.error("Managerlarni olishda xatolik:", error);
      setManagers([]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const [rowsRes, summaryRes] = await Promise.all([
          api.get<Plan[]>("/plans"),
          api.get<PlanSummary>("/plans/summary"),
        ]);

        setRows(rowsRes.data);
        setSummary(summaryRes.data);
      } else {
        const [rowsRes, summaryRes] = await Promise.all([
          api.get<Plan[]>("/plans/me"),
          api.get<PlanSummary>("/plans/me/summary"),
        ]);
        setRows(rowsRes.data);
        setSummary(summaryRes.data);
      }
    } catch (error) {
      console.error("Planlarni olishda xatolik:", error);
      setRows([]);
      setSummary(emptySummary);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectManager = (manager: ManagerUser) => {
    setSelectedManagerId(String(manager.id));
    setManagerSearch(manager.fullName);
    setShowManagerDropdown(false);
  };

  const handleFilterByManager = async () => {
    if (!selectedManagerId) {
      alert("Avval manager tanlang");
      return;
    }

    try {
      setLoading(true);

      const [rowsRes, summaryRes] = await Promise.all([
        api.get<Plan[]>(`/plans/user/${selectedManagerId}`),
        api.get<PlanSummary>(`/plans/summary/user/${selectedManagerId}` ),
      ]);

      setRows(rowsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Manager bo‘yicha filterda xatolik:", error);
      setRows([]);
      setSummary(emptySummary);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setManagerSearch("");
    setSelectedManagerId("");
    setShowManagerDropdown(false);
    await fetchData();
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Rostan ham planni o‘chirmoqchimisiz?");
    if (!ok) return;

    await api.delete(`/plans/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchManagers();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Plan / Fakt"
          subtitle="Planlar, faktlar va taqqoslash natijalari"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Jami planlar</p>
            <h3 className="mt-2 text-2xl font-bold">{summary.totalPlans}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Fakt yozilgan</p>
            <h3 className="mt-2 text-2xl font-bold">{summary.factWrittenCount}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Mukofotga yaqinlar</p>
            <h3 className="mt-2 text-2xl font-bold text-green-600">
              {summary.rewardEligibleCount}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">O‘rtacha foiz</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {summary.avgOverallPercent}%
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              {isAdmin ? (
                <div className="space-y-2" ref={managerSearchBoxRef}>
                  <label className="text-sm font-medium text-slate-700">
                    Manager bo‘yicha qidirish
                  </label>

                  <TextInput
                    placeholder="Kamida 2 ta harf yozing..."
                    value={managerSearch}
                    onFocus={() => {
                      if (managerSearch.trim().length >= 2) {
                        setShowManagerDropdown(true);
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setManagerSearch(value);
                      setSelectedManagerId("");
                      if (value.trim().length >= 2) {
                        setShowManagerDropdown(true);
                      } else {
                        setShowManagerDropdown(false);
                      }
                    }}
                  />

                  {managerSearch.trim().length > 0 &&
                  managerSearch.trim().length < 2 ? (
                    <div className="text-sm text-slate-400">
                      Natija chiqishi uchun kamida 2 ta harf yozing
                    </div>
                  ) : null}

                  {showManagerDropdown && filteredManagers.length > 0 ? (
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow">
                      {filteredManagers.map((manager) => (
                        <button
                          key={manager.id}
                          type="button"
                          onClick={() => handleSelectManager(manager)}
                          className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                            Number(selectedManagerId) === manager.id
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <span className="font-medium text-slate-900">
                            {manager.fullName}
                          </span>
                          <span className="text-sm text-slate-500">
                            {manager.login}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {showManagerDropdown &&
                  managerSearch.trim().length >= 2 &&
                  filteredManagers.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500">
                      Manager topilmadi
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-500">Foydalanuvchi</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {user?.fullName}
                  </h3>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {isAdmin ? (
                <>
                  <PrimaryButton type="button" onClick={handleFilterByManager}>
                    Manager bo‘yicha
                  </PrimaryButton>

                  <button
                    onClick={handleReset}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700"
                  >
                    Reset
                  </button>
                </>
              ) : null}

              <PrimaryButton
                type="button"
                onClick={() => {
                  setEditPlan(null);
                  setPlanModalOpen(true);
                }}
              >
                Plan yozish
              </PrimaryButton>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500">Yuklanmoqda...</div>
        ) : (
          <PlansTable
            rows={rows}
            onEdit={(plan) => {
              setEditPlan(plan);
              setPlanModalOpen(true);
            }}
            onDelete={handleDelete}
            onFact={(plan) => {
              setSelectedPlan(plan);
              setFactModalOpen(true);
            }}
            onStatus={(plan) => {
              setSelectedPlan(plan);
              setStatusModalOpen(true);
            }}
            onView={(plan) => {
              setSelectedPlan(plan);
              setDetailModalOpen(true);
            }}
          />
        )}
[3/14/26 8:50 AM] بهروز: <PlanFormModal
          open={planModalOpen}
          onClose={() => {
            setPlanModalOpen(false);
            setEditPlan(null);
          }}
          onSuccess={fetchData}
          editData={editPlan}
        />

        <FactFormModal
          open={factModalOpen}
          onClose={() => {
            setFactModalOpen(false);
            setSelectedPlan(null);
          }}
          onSuccess={fetchData}
          plan={selectedPlan}
        />

        <PlanStatusModal
          open={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedPlan(null);
          }}
          onSuccess={fetchData}
          plan={selectedPlan}
        />

        <PlanDetailModal
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      </div>
    </MainLayout>
  );
}