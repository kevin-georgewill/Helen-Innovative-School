"use client";

import { Trash2 } from "lucide-react";

interface QuestionCardProps {
  number: number;
  question: string;
  onDelete?: () => void;
}

export default function QuestionCard({
  number,
  question,
  onDelete,
}: QuestionCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">

      {/* Left Side */}
      <div className="flex items-center gap-4">

        {/* Question Number */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
          {number}
        </div>

        {/* Question */}
        <p className="text-base font-medium text-gray-800">
          {question}
        </p>

      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
        aria-label={`Delete question ${number}`}
      >
        <Trash2 size={20} />
      </button>

    </div>
  );
}