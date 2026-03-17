export interface DashboardAnalytics {
  users: {
    total: number;
    admins: number;
    managers: number;
  };
  payments: {
    totalCount: number;
    totalCash: number;
    totalDebt: number;
    todayCount: number;
    todayCash: number;
  };
  attendance: {
    todayCount: number;
    checkedInCount: number;
    checkedOutCount: number;
    lateCount: number;
  };
  plans: {
    monthlyPlansCount: number;
    monthlyPlanCash: number;
    monthlyFactCash: number;
  };
  penalties: {
    totalCount: number;
    totalAmount: number;
  };
  leads: {
    total: number;
    today: number;
    yangiLid: number;
    ishgaOlindi: number;
    aloqa: number;
    konsultatsiya: number;
    qiziqish: number;
    hisob: number;
    pre: number;
    toliq: number;
    kotargan: number;
    kotarmagan: number;
  };
}

export interface ManagerAnalytics {
  managerId: number;
  month: number;
  year: number;
  payments: {
    count: number;
    totalCash: number;
    totalDebt: number;
  };
  facts: {
    count: number;
    factCalls: number;
    factTalks: number;
    factSalesCount: number;
    factTotalCash: number;
  };
  attendance: {
    checkedInCount: number;
    checkedOutCount: number;
    lateCount: number;
  };
  penalties: {
    count: number;
    totalAmount: number;
  };
  monthlyPlan: {
    id: number;
    planCalls: number;
    planTalks: number;
    planSalesCount: number;
    planTotalCash: number;
    rewardName: string | null;
    penaltyTask: string | null;
  } | null;
  today: string;
}