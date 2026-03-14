export interface LeadAnalytics {
  jamiLid: number;
  yangiLid: number;
  ishgaOlindi: number;
  aloqaOrnatildi: number;
  konsultatsiyaBerildi: number;
  qiziqishBildirdi: number;
  hisobRaqamYuborildi: number;
  preDaplata: number;
  toliqTolov: number;
  kotargan: number;
  kotarmagan: number;
}

export interface DashboardAnalytics extends LeadAnalytics {
  paymentsCount: number;
  totalPaymentAmount: number;
  totalDebt: number;
}

export interface PaymentSummary {
  paymentsCount: number;
  totalAmount: number;
  totalDebt: number;
}

export interface PaymentByManager {
  manager: string;
  count: number;
  amount: number;
  debt: number;
}

export interface RangeAnalytics {
  rows: {
    id: number;
    date: string;
    yangiLid: number;
    ishgaOlindi: number;
    aloqaOrnatildi: number;
    konsultatsiyaBerildi: number;
    qiziqishBildirdi: number;
    hisobRaqamYuborildi: number;
    preDaplata: number;
    toliqTolov: number;
    kotargan: number;
    kotarmagan: number;
  }[];
  summary: LeadAnalytics;
}