export interface AttendanceUser {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

export interface Attendance {
  id: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInImage: string | null;
  checkOutImage: string | null;
  late: boolean;
  lateMinutes: number;
  user: AttendanceUser;
  createdAt?: string;
  updatedAt?: string;
}