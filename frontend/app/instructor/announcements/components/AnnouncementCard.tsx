"use client";

import { BookOpen, Pencil } from "lucide-react";

interface AnnouncementCardProps {
  title: string;
  message: string;
  onEdit?: () => void;
}

export default function AnnouncementCard({
  title,
  message,
  onEdit,
}: AnnouncementCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">

      <div className="flex items-start justify-between gap-6">

        {/* Left Side */}
        <div className="flex flex-1 items-start gap-5">

          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100">

            <BookOpen
              size={30}
              className="text-blue-700"
            />

          </div>

          {/* Content */}
          <div className="flex-1">

            <h3 className="text-2xl font-bold text-slate-900">
              {title}
            </h3>

            <p className="mt-2 text-base leading-7 text-slate-500">
              {message}
            </p>

          </div>

        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-blue-100
            px-5
            py-2
            text-sm
            font-semibold
            text-blue-700
            transition
            hover:bg-blue-200
          "
        >
          <Pencil size={16} />

          Edit
        </button>

      </div>

    </div>
  );
}