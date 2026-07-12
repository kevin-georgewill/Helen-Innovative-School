import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";

import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
} from "lucide-react";

export default function InstructorProfilePage() {
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
        name="Dr. Sarah Oladejo"
        department="Computer Science"
        qualification="PhD in Artificial Intelligence"
        email="saraholadejo@his.com"
        phone="+234 714 789 987"
        country="Nigeria"
        workDays="Mon - Fri"
        image="/profile.png"
      />

      {/* Statistics */}
      <section>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <StatsCard
            title="Total Students"
            value={345}
            icon={Users}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />

          <StatsCard
            title="Courses"
            value={5}
            icon={BookOpen}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatsCard
            title="Years of Experience"
            value={8}
            icon={GraduationCap}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatsCard
            title="Awards"
            value={17}
            icon={Award}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />

        </div>

      </section>

    </div>
  );
}