import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@/constants";
import {
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  CalendarDays,
  Music2,
  Library,
  UserPlus,
} from "lucide-react";

import {
  DashboardHeader,
  StatsCard,
  TodaysSessions,
  UpcomingSessions,
  RecentEnrollments,
} from "@/components/dashboard";
import type { DashboardResponse } from "@/components/dashboard/dashboard-types";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}dashboard`);

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const json = await response.json();
        console.log("Dashboard API Response:", json);

        setDashboard(json);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (isError || !dashboard) {
    return <div className="p-8 text-center">Failed to load dashboard.</div>;
  }

  const stats = [
    {
      title: "Students",
      value: dashboard.stats.students,
      icon: GraduationCap,
    },
    {
      title: "Teachers",
      value: dashboard.stats.teachers,
      icon: Users,
    },
    {
      title: "Departments",
      value: dashboard.stats.departments,
      icon: Library,
    },
    {
      title: "Subjects",
      value: dashboard.stats.subjects,
      icon: BookOpen,
    },
    {
      title: "Courses",
      value: dashboard.stats.courses,
      icon: Music2,
    },
    {
      title: "Batches",
      value: dashboard.stats.batches,
      icon: Layers,
    },
    {
      title: "Sessions",
      value: dashboard.stats.sessions,
      icon: CalendarDays,
    },
    {
      title: "Enrollments",
      value: dashboard.stats.enrollments,
      icon: UserPlus,
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <DashboardHeader />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TodaysSessions sessions={dashboard.today} />

        <UpcomingSessions sessions={dashboard.upcoming} />

        <RecentEnrollments enrollments={dashboard.recent.enrollments} />
      </div>
    </div>
  );
};

export default Dashboard;
