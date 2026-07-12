"use client";

import { Plus } from "lucide-react";
import QuestionCard from "./QuestionCard";

interface Question {
  id: number;
  text: string;
}

interface QuestionListProps {
  questions: Question[];
  onAddQuestion?: () => void;
  onDeleteQuestion?: (id: number) => void;
}

export default function QuestionList({
  questions,
  onAddQuestion,
  onDeleteQuestion,
}: QuestionListProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <h2 className="text-2xl font-bold text-slate-900">
          Set Questions
        </h2>

        <button
          type="button"
          onClick={onAddQuestion}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          <Plus size={18} />
          Add Question
        </button>

      </div>

      {/* Questions */}
      <div className="space-y-4">

        {questions.length > 0 ? (
          questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              number={index + 1}
              question={question.text}
              onDelete={() =>
                onDeleteQuestion?.(question.id)
              }
            />
          ))
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 py-12 text-center">

            <h3 className="text-lg font-semibold text-gray-700">
              No questions added
            </h3>

            <p className="mt-2 text-gray-500">
              Click <strong>Add Question</strong> to create your first question.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}