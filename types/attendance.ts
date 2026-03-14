import { AuthUser } from "./user";

export interface Attendance {
  id: number;
  user: AuthUser & {
    phone?: string;
    image?: string | null;
  };
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInImage: string | null;
  checkOutImage: string | null;
  late: boolean;
  lateMinutes: number;
  penaltyCreated: boolean;
  createdAt?: string;
  updatedAt?: string;
}