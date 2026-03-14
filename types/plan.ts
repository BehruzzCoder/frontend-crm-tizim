import { AuthUser } from "./user";

export type PlanType = "daily" | "weekly" | "monthly";
export type RewardStatus = "pending" | "given" | "not_given";
export type PenaltyTaskStatus = "pending" | "done" | "not_done";

export interface Plan {
  id: number;
  user: AuthUser;
  type: PlanType;
  startDate: string;
  endDate: string | null;

  planCalls: number;
  planTalks: number;
  planInterestedClients: number;
  planSalesCount: number;
  planCashSales: number;
  planContractSales: number;
  planDebt: number;
  planTotalCash: number;

  factCalls: number;
  factTalks: number;
  factInterestedClients: number;
  factSalesCount: number;
  factCashSales: number;
  factContractSales: number;
  factDebt: number;
  factTotalCash: number;

  factWritten: boolean;

  callsPercent: number;
  talksPercent: number;
  interestedPercent: number;
  salesCountPercent: number;
  cashSalesPercent: number;
  contractSalesPercent: number;
  debtPercent: number;
  totalCashPercent: number;
  overallPercent: number;

  rewardName: string | null;
  rewardStatus: RewardStatus;
  rewardEligible: boolean;

  penaltyTask: string | null;
  penaltyTaskStatus: PenaltyTaskStatus;
  penaltyEligible: boolean;

  adminComment: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanSummary {
  totalPlans: number;
  factWrittenCount: number;
  rewardEligibleCount: number;
  penaltyEligibleCount: number;
  avgOverallPercent: number;
  totalPlanCalls: number;
  totalFactCalls: number;
  totalPlanTalks: number;
  totalFactTalks: number;
  totalPlanInterestedClients: number;
  totalFactInterestedClients: number;
  totalPlanSalesCount: number;
  totalFactSalesCount: number;
  totalPlanCashSales: number;
  totalFactCashSales: number;
  totalPlanContractSales: number;
  totalFactContractSales: number;
  totalPlanDebt: number;
  totalFactDebt: number;
  totalPlanTotalCash: number;
  totalFactTotalCash: number;
}