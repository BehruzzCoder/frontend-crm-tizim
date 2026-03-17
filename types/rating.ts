export interface RatingManager {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

export interface RatingItem {
  rank: number;
  manager: RatingManager;
  totalCash: number;
}