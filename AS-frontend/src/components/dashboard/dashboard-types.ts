export interface DashboardStats {
  students: number;
  teachers: number;
  departments: number;
  subjects: number;
  courses: number;
  batches: number;
  sessions: number;
  enrollments: number;
}

export interface TodaySession {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export interface UpcomingSession {
  id: number;
  name: string;
  sessionDate: string;
  startTime: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  image?: string;
}

export interface RecentEnrollment {
  id: number;
  enrolledAt: string;
  student: DashboardUser;
}

export interface DashboardResponse {
  stats: DashboardStats;

  today: TodaySession[];

  upcoming: UpcomingSession[];

  recent: {
    students: DashboardUser[];
    teachers: DashboardUser[];
    enrollments: RecentEnrollment[];
  };
}