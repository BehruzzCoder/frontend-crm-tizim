export interface SettingsItem {
  id: number;
  workStartTime: string;
  workEndTime: string;
  latePenaltyAmount: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface Settings {
  id: number;
  workStartTime: string;
  workEndTime: string;
  latePenaltyAmount: number;
  createdAt?: string;
  updatedAt?: string;
  defaultPenaltyAmount: number;
  repeatedPenaltyIncrease: number;
}