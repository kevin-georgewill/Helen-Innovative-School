'use client'

import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import { useInstructorMe } from "@/lib/queries/instructors";

import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
} from "lucide-react";

export default function InstructorProfilePage() {
  const { data: instructor, isLoading, error } = useInstructorMe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-red-500">
          Failed to load instructor profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="text-gray-500">
          View and manage your profile information
        </p>
      </div>

      {/* Profile Card */}
      <ProfileCard
        name={instructor.profiles?.full_name ?? "Instructor"}
        department={instructor.expertise ?? "Not provided"}
        qualification={instructor.professional_title ?? "Not provided"}
        email={instructor.email ?? ""}
        phone={instructor.profiles?.phone ?? "Not provided"}
        country="Nigeria"
        workDays="Mon - Fri"
        image={
          instructor.profiles?.avatar_url || "/profile.png"
        }
      />

      {/* Statistics */}
      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <StatsCard
            title="Total Students"
            value={0}
            icon={Users}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />

          <StatsCard
            title="Courses"
            value={0}
            icon={BookOpen}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatsCard
            title="Years of Experience"
            value={instructor.years_of_experience ?? 0}
            icon={GraduationCap}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatsCard
            title="Awards"
            value={0}
            icon={Award}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />

        </div>
      </section>

    </div>
  );
}