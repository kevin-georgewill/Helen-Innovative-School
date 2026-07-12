"use client";

import AttendanceCard from "./AttendanceCard";

interface AttendanceSession {
  id: number;
  course: string;
  date: string;
  time: string;
  present: number;
  absent: number;
  late: number;
}

interface AttendanceSessionsProps {
  sessions: AttendanceSession[];
}

export default function AttendanceSessions({
  sessions,
}: AttendanceSessionsProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-8">

        <h2 className="text-3xl font-bold text-slate-900">
          Recent Attendance Sessions
        </h2>

        <p className="mt-2 text-gray-500">
          View and manage attendance records
        </p>

      </div>

      {/* Sessions */}

      <div className="space-y-8">

        {sessions.length > 0 ? (
          sessions.map((session) => (
            <AttendanceCard
              key={session.id}
              course={session.course}
              date={session.date}
              time={session.time}
              present={session.present}
              absent={session.absent}
              late={session.late}
            />
          ))
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 py-16 text-center">

            <h3 className="text-lg font-semibold text-slate-700">
              No attendance records found
            </h3>

            <p className="mt-2 text-gray-500">
              Attendance sessions will appear here after they are recorded.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}