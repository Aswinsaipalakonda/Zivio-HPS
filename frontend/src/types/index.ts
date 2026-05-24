export type UserRole = "MANAGER" | "DIRECTOR" | "EMPLOYEE" | "INTERN";

export interface User {
  id: string;
  clerk_user_id: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  department: string | null;
  profile_picture_url: string | null;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "NOT_STARTED";

export interface TaskAssignment {
  id: string;
  assigned_to: User;
  assigned_by: User;
  title: string;
  description: string;
  assignment_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskLog {
  id: string;
  assignment: string; // TaskAssignment UUID
  submitted_by: string; // User UUID
  status: TaskStatus;
  notes: string | null;
  logged_at: string;
  log_date: string;
}

export interface TaskWithLog extends TaskAssignment {
  log: TaskLog | null;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

export interface Attendance {
  id: string;
  user: string; // User UUID
  date: string;
  check_in_time: string | null;
  status: AttendanceStatus;
  auto_recorded: boolean;
}

export interface AnalyticsDay {
  date: string;
  completed: number;
  in_progress: number;
  pending: number;
  not_started: number;
  total?: number;
}

export interface AnalyticsPerPerson {
  user_id: string;
  full_name: string;
  total_tasks: number;
  completed: number;
  completion_rate_percent: number;
}
