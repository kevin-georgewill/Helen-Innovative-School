"use client";

import {
  FileVideo,
  FileText,
  ClipboardPlus,
  Megaphone,
} from "lucide-react";

const actions = [
  {
    title: "Upload Video",
    icon: FileVideo,
  },
  {
    title: "Upload PDF",
    icon: FileText,
  },
  {
    title: "New Quiz",
    icon: ClipboardPlus,
  },
  {
    title: "Announce",
    icon: Megaphone,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-3xl font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="
                group
                flex
                flex-col
                items-center
                justify-center
                gap-5
                rounded-3xl
                bg-blue-50
                p-10
                transition-all
                duration-300
                hover:bg-blue-100
                hover:shadow-md
              "
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F2E73]">

                <Icon
                  size={30}
                  className="text-white"
                />

              </div>

              <span className="text-2xl font-semibold text-[#0F2E73]">
                {action.title}
              </span>
            </button>
          );
        })}

      </div>

    </section>
  );
}