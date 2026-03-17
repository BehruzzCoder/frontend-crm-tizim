export interface PaymentManager {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

export interface Payment {
  id: number;
  managerId: number;
  clientName: string;
  phone: string;
  tariff: string;
  paymentType: string;
  amount: number;
  contractAmount: number;
  debt: number;
  receipts: string[];
  bonusGiven: boolean;
  createdAt: string;
  manager: PaymentManager;
}