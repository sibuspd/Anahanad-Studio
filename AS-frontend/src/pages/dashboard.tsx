import { useCustom } from "@refinedev/core";

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
  const { data, isLoading, isError } = useCustom<DashboardResponse>({
    url: "/dashboard",
    method: "get",
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (isError || !data?.data) {
    return <div className="p-8 text-center">Failed to load dashboard.</div>;
  }

  const dashboard = data.data;

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
