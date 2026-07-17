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

import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader, StatsCard } from "@/components/dashboard";
import type { DashboardResponse } from "@/components/dashboard/dashboard-types";


const Dashboard = () => {
  const { data, isLoading, isError } =
    useCustom<DashboardResponse>({
      url: "/dashboard",
      method: "get",
    });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-8 text-center">
        Failed to load dashboard.
      </div>
    );
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

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome to Anahanad Studio ERP
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((card) => {

          const Icon = card.icon;

          return (
            <Card key={card.title}>

              <CardContent className="flex items-center justify-between p-6">

                <div>

                  <p className="text-sm text-muted-foreground">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {card.value}
                  </h2>

                </div>

                <Icon className="h-9 w-9 opacity-70" />

              </CardContent>

            </Card>
          );

        })}

      </div>

    </div>
  );
};

export default Dashboard;