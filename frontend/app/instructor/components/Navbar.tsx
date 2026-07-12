"use client";

import Image from "next/image";
import {
  Search,
  Bell,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-8 py-5">

      {/* Search Bar */}
      <div className="relative w-full max-w-2xl">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search students, assignments, courses..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-12 pr-5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* Right Section */}
      <div className="ml-8 flex items-center gap-5">

        {/* Messages */}
        <button className="relative rounded-full p-2 transition hover:bg-gray-100">
          <MessageCircle
            size={22}
            className="text-gray-600"
          />
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-2 transition hover:bg-gray-100">

          <Bell
            size={22}
            className="text-gray-600"
          />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>

        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User */}
        <button className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100">

          <Image
            src="/profile.png"
            alt="Instructor"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />

          <div className="hidden text-left md:block">
            <h4 className="text-sm font-semibold text-gray-900">
              Dr. Sarah Oladejo
            </h4>

            <p className="text-xs text-gray-500">
              Instructor
            </p>
          </div>

          <ChevronDown
            size={18}
            className="text-gray-500"
          />

        </button>

      </div>

    </nav>
  );
}