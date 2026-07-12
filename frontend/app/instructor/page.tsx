import WelcomeBanner from "./components/WelcomeBanner";
import QuickActions from "./components/QuickActions";
import Notifications from "./components/Notifications";
import RecentActivities from "./components/RecentActivities";

import StatsCard from "./components/StatsCard";

import {
  BookOpen,
  Users,
  ClipboardList,
  Video,
} from "lucide-react";

export default function DashboardPage() {
  const notifications = [
    {
      id: 1,
      message: "12 assignments have been submitted today.",
    },
    {
      id: 2,
      message: "Algorithm explanations video has been uploaded successfully.",
    },
  ];

  const activities = [
    {
      id: 1,
      user: "Amaka O.",
      activity:
        "just submitted quiz on Introduction to Algorithm.",
      time: "2m ago",
    },
    {
      id: 2,
      user: "",
      activity:
        "Algorithm explanations video has been uploaded successfully.",
      time: "2m ago",
    },
  ];

  return (
    <div className="space-y-8">

      <WelcomeBanner
        name="Dr. Sarah"
        department="School of Cybersecurity and Digital Safety"
        date="Thursday, June 25, 2026"
      />

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Total Courses"
          value={8}
          icon={BookOpen}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Total Students"
          value={356}
          icon={Users}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Pending Assignments"
          value={23}
          icon={ClipboardList}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatsCard
          title="Upcoming Classes"
          value={15}
          icon={Video}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

      </section>

      <QuickActions />

      <Notifications notifications={notifications} />

      <RecentActivities activities={activities} />

    </div>
  );
}