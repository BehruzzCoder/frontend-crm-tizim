export interface MonthlyPlanUser {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

export interface MonthlyPlan {
  id: number;
  month: number;
  year: number;
  planCalls: number;
  planTalks: number;
  planSalesCount: number;
  planCashSales: number;
  planContractSales: number;
  planDebt: number;
  planTotalCash: number;
  rewardName: string | null;
  penaltyTask: string | null;
  rewardStatus: string;
  penaltyTaskStatus: string;
  adminComment: string | null;
  user: MonthlyPlanUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyFact {
  id: number;
  date: string;
  factCalls: number;
  factTalks: number;
  factSalesCount: number;
  factCashSales: number;
  factContractSales: number;
  factDebt: number;
  factTotalCash: number;
  monthlyPlan: MonthlyPlan;
  user: MonthlyPlanUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgressPercent {
  callsPercent: number;
  talksPercent: number;
  salesCountPercent: number;
  cashSalesPercent: number;
  contractSalesPercent: number;
  debtPercent: number;
  totalCashPercent: number;
}

export interface ProgressBlock {
  type: "daily" | "weekly" | "monthly";
  monthlyPlanId: number;
  plan: {
    planCalls: number;
    planTalks: number;
    planSalesCount: number;
    planCashSales: number;
    planContractSales: number;
    planDebt: number;
    planTotalCash: number;
  };
  fact: {
    factCalls: number;
    factTalks: number;
    factSalesCount: number;
    factCashSales: number;
    factContractSales: number;
    factDebt: number;
    factTotalCash: number;
  };
  percent: ProgressPercent;
  overallPercent: number;
  date?: string;
  week?: number;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  rewardName?: string | null;
  rewardStatus?: string;
  penaltyTask?: string | null;
  penaltyTaskStatus?: string;
  adminComment?: string | null;
  facts?: DailyFact[];
}

export interface DashboardProgress {
  daily: ProgressBlock;
  weekly: ProgressBlock;
  monthly: ProgressBlock;
}
export interface Plan{
  id: number;
  month: number;
  year: number;
  planCalls: number;
  planTalks: number;
  planSalesCount: number;
  planCashSales: number;
  planContractSales: number;
  planDebt: number;
  planTotalCash: number;
  rewardName: string | null;
  factCalls?: number;
  factTalks?: number;
  factSalesCount?: number;
  factCashSales?: number;
  factContractSales?: number;
  factDebt?: number;
  factTotalCash?: number;
  rewardStatus?: string;
  penaltyTask?: string | null;
  penaltyTaskStatus?: string;
  adminComment?: string | null;
  user?: MonthlyPlanUser;
  createdAt?: string;
  updatedAt?: string;
}