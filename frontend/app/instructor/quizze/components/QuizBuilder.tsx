"use client";

import { CalendarDays } from "lucide-react";

interface QuizData {
  title: string;
  instructions: string;
  deadline: string;
  passMark: string;
}

interface QuizBuilderProps {
  quiz: QuizData;
  setQuiz: React.Dispatch<React.SetStateAction<QuizData>>;
}

export default function QuizBuilder({
  quiz,
  setQuiz,
}: QuizBuilderProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      {/* Heading */}
      <h2 className="mb-8 text-3xl font-bold text-slate-900">
        Quiz Builder
      </h2>


      {/* Title */}
      <div className="mb-8">

        <label className="mb-3 block text-lg font-semibold text-slate-800">
          Title
        </label>

        <input
          type="text"
          value={quiz.title}
          onChange={(e) =>
            setQuiz((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder="Enter quiz title"
          className="
            w-full
            rounded-2xl
            border
            border-gray-300
            px-5
            py-4
            text-base
            outline-none
            transition
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />

      </div>



      {/* Instructions */}
      <div className="mb-8">

        <label className="mb-3 block text-lg font-semibold text-slate-800">
          Instructions
        </label>

        <textarea
          rows={5}
          value={quiz.instructions}
          onChange={(e) =>
            setQuiz((prev) => ({
              ...prev,
              instructions: e.target.value,
            }))
          }
          placeholder="Enter quiz instructions..."
          className="
            w-full
            resize-none
            rounded-2xl
            border
            border-gray-300
            px-5
            py-4
            text-base
            outline-none
            transition
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />

      </div>




      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


        {/* Deadline */}
        <div>

          <label className="mb-3 block text-lg font-semibold text-slate-800">
            Deadline
          </label>


          <div className="relative">

            <input
              type="date"
              value={quiz.deadline}
              onChange={(e) =>
                setQuiz((prev) => ({
                  ...prev,
                  deadline: e.target.value,
                }))
              }
              className="
                w-full
                rounded-2xl
                border
                border-gray-300
                px-5
                py-4
                pr-12
                outline-none
                transition
                focus:border-blue-600
                focus:ring-2
                focus:ring-blue-100
              "
            />


            <CalendarDays
              size={20}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-gray-500
              "
            />

          </div>

        </div>




        {/* Pass Mark */}
        <div>

          <label className="mb-3 block text-lg font-semibold text-slate-800">
            Pass Mark (%)
          </label>


          <input
            type="number"
            min={0}
            max={100}
            value={quiz.passMark}
            onChange={(e) =>
              setQuiz((prev) => ({
                ...prev,
                passMark: e.target.value,
              }))
            }
            placeholder="70"
            className="
              w-full
              rounded-2xl
              border
              border-gray-300
              px-5
              py-4
              outline-none
              transition
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>


      </div>


    </section>
  );
}