"use client";

import { Plus } from "lucide-react";

interface QuizHeaderProps {
  onCreateQuiz?: () => void;
}

export default function QuizHeader({
  onCreateQuiz,
}: QuizHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

      {/* Header Text */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Quizzes & Exams
        </h1>

        <p className="mt-2 text-base text-gray-500">
          Create, manage and monitor your quizzes and exams.
        </p>
      </div>


      {/* Create Button */}
      <button
        type="button"
        onClick={onCreateQuiz}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-blue-900
          px-8
          py-4
          text-lg
          font-semibold
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:bg-blue-800
          hover:shadow-md
          active:scale-95
        "
      >
        <Plus size={22} />

        <span>
          Set Quiz / Exam
        </span>

      </button>

    </div>
  );
}