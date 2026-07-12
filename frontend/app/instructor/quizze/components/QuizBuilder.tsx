"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

export default function QuizBuilder() {
  const [title, setTitle] = useState("Advanced Machine Learning");
  const [instructions, setInstructions] = useState(
    "Answer all questions."
  );
  const [deadline, setDeadline] = useState("");
  const [passMark, setPassMark] = useState("70");

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-base outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* Instructions */}
      <div className="mb-8">

        <label className="mb-3 block text-lg font-semibold text-slate-800">
          Instructions
        </label>

        <textarea
          rows={5}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter quiz instructions..."
          className="w-full resize-none rounded-2xl border border-gray-300 px-5 py-4 text-base outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 pr-12 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <CalendarDays
              size={20}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
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
            value={passMark}
            onChange={(e) => setPassMark(e.target.value)}
            placeholder="70"
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

    </section>
  );
}