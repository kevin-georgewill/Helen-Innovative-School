"use client";

import {
  BookOpen,
  Users,
  ClipboardList,
  Video,
} from "lucide-react";

import WelcomeBanner from "./components/WelcomeBanner";
import QuickActions from "./components/QuickActions";
import Notifications from "./components/Notifications";
import RecentActivities from "./components/RecentActivities";
import StatsCard from "./components/StatsCard";

import { useInstructorDashboard } from "@/lib/queries/dashboard";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    error,
  } = useInstructorDashboard() as {
    data: any;
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg text-red-500">
          Failed to load dashboard.
        </p>
      </div>
    );
  }

  const instructor = data.instructor;

  return (
    <div className="space-y-8">

      <WelcomeBanner
        name={instructor?.full_name ?? "Instructor"}
        department={
          instructor?.professional_title ?? "Instructor"
        }
        date={new Date().toLocaleDateString("en-NG", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      />

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Total Courses"
          value={data.stats.total_courses}
          icon={BookOpen}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Total Students"
          value={data.stats.total_students}
          icon={Users}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Pending Assignments"
          value={data.stats.pending_assignments}
          icon={ClipboardList}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatsCard
          title="Upcoming Classes"
          value={data.stats.upcoming_classes}
          icon={Video}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

      </section>

      <QuickActions />

      <Notifications
        notifications={data.notifications}
      />

      <RecentActivities
        activities={data.recent_activities}
      />

    </div>
  );
}