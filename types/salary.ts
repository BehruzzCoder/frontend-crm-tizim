export interface SalaryPercent {
  callsPercent: number;
  talksPercent: number;
  salesCountPercent: number;
  cashSalesPercent: number;
  contractSalesPercent: number;
  debtPercent: number;
  totalCashPercent: number;
}

export interface SalaryPlan {
  planCalls: number;
  planTalks: number;
  planSalesCount: number;
  planCashSales: number;
  planContractSales: number;
  planDebt: number;
  planTotalCash: number;
}

export interface SalaryFact {
  factCalls: number;
  factTalks: number;
  factSalesCount: number;
  factCashSales: number;
  factContractSales: number;
  factDebt: number;
  factTotalCash: number;
}

export interface SalaryMeResponse {
  userId: number;
  month: number;
  year: number;
  overallPercent: number;
  plan: SalaryPlan;
  fact: SalaryFact;
  percent: SalaryPercent;
  kassagaTushganPul: number;
  foizStavka: number;
  conversionBonus: number;
  monthlyTaskBonus: number;
  oylikPercentMoney: number;
  jami: number;
  rewardName: string | null;
  rewardStatus: string;
  penaltyTask: string | null;
  penaltyTaskStatus: string;
}

export interface SalaryManager {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

export interface SalaryAllItem extends Partial<SalaryMeResponse> {
  manager: SalaryManager;
  error?: string;
}