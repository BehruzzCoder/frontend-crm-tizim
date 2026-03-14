export interface PaymentManager {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

export interface Payment {
  id: number;
  fullName: string;
  phone: string;
  manager: PaymentManager | null;
  stream: string;
  tariff: string;
  amount: number;
  debt: number;
  receipt: string | null;
  paymentType: string;
  createdAt?: string;
  updatedAt?: string;
}