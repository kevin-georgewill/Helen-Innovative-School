"use client";

import Link from "next/link";
import ActivityCard from "./ActivityCard";

interface Activity {
  id: number;
  user: string;
  activity: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-gray-900">
          Recent Activities
        </h2>

        <Link
          href="/instructor/activities"
          className="text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          See all
        </Link>

      </div>

      {/* Activities */}

      <div className="space-y-4">

        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              user={activity.user}
              activity={activity.activity}
              time={activity.time}
            />
          ))
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 py-10 text-center">

            <p className="text-gray-500">
              No recent activities.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}