"use client";

import { Pencil, Trash2 } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionCardProps {
  number: number;
  question: Question;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function QuestionCard({
  number,
  question,
  onDelete,
  onEdit,
}: QuestionCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md
      "
    >

      {/* Header */}
      <div className="flex items-start justify-between gap-4">


        {/* Question Number + Text */}
        <div className="flex gap-4">


          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-blue-100
              font-semibold
              text-blue-700
            "
          >
            {number}
          </div>


          <div>

            <h3 className="text-base font-semibold text-gray-900">
              {question.text}
            </h3>

          </div>


        </div>




        {/* Actions */}
        <div className="flex items-center gap-2">


          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            className="
              rounded-lg
              p-2
              text-blue-600
              transition
              hover:bg-blue-50
            "
            aria-label={`Edit question ${number}`}
          >
            <Pencil size={18} />
          </button>



          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="
              rounded-lg
              p-2
              text-red-500
              transition
              hover:bg-red-50
              hover:text-red-600
            "
            aria-label={`Delete question ${number}`}
          >
            <Trash2 size={18} />
          </button>


        </div>


      </div>





      {/* Options */}
      <div className="mt-5 space-y-2">


        {question.options.map((option) => (

          <div
            key={option}
            className={`
              rounded-xl
              border
              px-4
              py-3
              text-sm
              ${
                option === question.correctAnswer
                  ? "border-green-300 bg-green-50 text-green-700 font-medium"
                  : "border-gray-200 text-gray-700"
              }
            `}
          >

            {option}


            {option === question.correctAnswer && (
              <span className="ml-2 text-xs">
                ✓ Correct Answer
              </span>
            )}

          </div>

        ))}


      </div>


    </div>
  );
}