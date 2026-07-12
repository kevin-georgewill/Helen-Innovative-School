"use client";

import { Download, ClipboardCheck } from "lucide-react";

interface AttendanceHeaderProps {
  onDownloadReport?: () => void;
  onTakeAttendance?: () => void;
}

export default function AttendanceHeader({
  onDownloadReport,
  onTakeAttendance,
}: AttendanceHeaderProps) {
  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Attendance
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Track and manage students attendance
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap gap-4">

          <button
            type="button"
            onClick={onDownloadReport}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-300
              bg-white
              px-6
              py-3
              font-semibold
              text-slate-700
              transition
              hover:bg-gray-100
            "
          >
            <Download size={20} />
            Download Report
          </button>

          <button
            type="button"
            onClick={onTakeAttendance}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#0F2E73]
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-[#0B255C]
            "
          >
            <ClipboardCheck size={20} />
            Take Attendance
          </button>

        </div>

      </div>

    </section>
  );
}