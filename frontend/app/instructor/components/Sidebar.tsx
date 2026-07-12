"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  Bell,
  FileQuestion,
  UserCircle,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/instructor",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    title: "Students",
    href: "/instructor/students",
    icon: Users,
  },
  {
    title: "Attendance",
    href: "/instructor/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Announcements",
    href: "/instructor/announcements",
    icon: Bell,
  },
  {
    title: "Quizzes & Exams",
    href: "/instructor/quizze",
    icon: FileQuestion,
  },
  {
    title: "Profile",
    href: "/instructor/profile",
    icon: UserCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b px-6 py-8">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            Helen Innovative
          </h1>

          <p className="text-sm text-slate-500">
            School
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8">

        <ul className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/instructor" &&
                pathname.startsWith(item.href));

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200

                  ${
                    active
                      ? "bg-blue-50 text-blue-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active
                        ? "text-blue-900"
                        : "text-slate-500 group-hover:text-slate-900"
                    }`}
                  />

                  <span className="font-medium">
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}

        </ul>

      </nav>

      {/* Bottom Section */}
      <div className="border-t p-6">

        <div className="rounded-2xl bg-slate-100 p-4">

          <p className="text-sm font-semibold text-slate-900">
            Instructor Portal
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Helen Innovative School
          </p>

        </div>

      </div>

    </div>
  );
}