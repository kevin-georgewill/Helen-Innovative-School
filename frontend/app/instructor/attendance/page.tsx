import { Users, UserX } from "lucide-react";

import StatsCard from "../components/StatsCard";

import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceSessions from "./components/AttendanceSessions";

export default function AttendancePage() {
  // Sample data (replace with API data later)
  const sessions = [
    {
      id: 1,
      course: "Advanced Machine Learning",
      date: "June 25, 2026",
      time: "2:00 PM - 3:30 PM",
      present: 42,
      absent: 2,
      late: 1,
    },
    {
      id: 2,
      course: "Data Structure & Algorithms",
      date: "June 24, 2026",
      time: "10:00 AM - 11:30 AM",
      present: 32,
      absent: 10,
      late: 3,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <AttendanceHeader />

      {/* Attendance Summary */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <StatsCard
          title="Present Today"
          value={312}
          icon={Users}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Absent Today"
          value={31}
          icon={UserX}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />

      </section>

      {/* Attendance Sessions */}
      <AttendanceSessions sessions={sessions} />

    </div>
  );
}