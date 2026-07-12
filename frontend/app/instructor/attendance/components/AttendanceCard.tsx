"use client";

import {
  CalendarDays,
  Clock,
  Users,
  UserX,
  Timer,
} from "lucide-react";

interface AttendanceCardProps {
  course: string;
  date: string;
  time: string;
  present: number;
  absent: number;
  late: number;
}

export default function AttendanceCard({
  course,
  date,
  time,
  present,
  absent,
  late,
}: AttendanceCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Course */}
      <h3 className="text-2xl font-bold text-slate-900">
        {course}
      </h3>

      {/* Date & Time */}
      <div className="mt-4 flex flex-wrap items-center gap-6 text-gray-500">

        <div className="flex items-center gap-2">
          <CalendarDays
            size={18}
            className="text-gray-400"
          />

          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock
            size={18}
            className="text-gray-400"
          />

          <span>{time}</span>
        </div>

      </div>

      {/* Attendance Summary */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Present */}
        <div className="rounded-2xl bg-green-100 p-6 text-center">

          <div className="mb-3 flex justify-center">
            <Users
              size={28}
              className="text-green-600"
            />
          </div>

          <h4 className="text-4xl font-bold text-green-700">
            {present}
          </h4>

          <p className="mt-2 text-lg font-medium text-green-700">
            Present
          </p>

        </div>

        {/* Absent */}
        <div className="rounded-2xl bg-red-100 p-6 text-center">

          <div className="mb-3 flex justify-center">
            <UserX
              size={28}
              className="text-red-600"
            />
          </div>

          <h4 className="text-4xl font-bold text-red-700">
            {absent}
          </h4>

          <p className="mt-2 text-lg font-medium text-red-700">
            Absent
          </p>

        </div>

        {/* Late */}
        <div className="rounded-2xl bg-orange-100 p-6 text-center">

          <div className="mb-3 flex justify-center">
            <Timer
              size={28}
              className="text-orange-600"
            />
          </div>

          <h4 className="text-4xl font-bold text-orange-700">
            {late}
          </h4>

          <p className="mt-2 text-lg font-medium text-orange-700">
            Late
          </p>

        </div>

      </div>

    </div>
  );
}