"use client";

interface ActivityCardProps {
  user: string;
  activity: string;
  time: string;
}

export default function ActivityCard({
  user,
  activity,
  time,
}: ActivityCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100">

      {/* Avatar */}

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">

        {user
          ? user
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "SY"}

      </div>

      {/* Content */}

      <div className="flex-1">

        <p className="text-sm text-gray-800">

          {user && (
            <span className="font-semibold">
              {user}{" "}
            </span>
          )}

          {activity}

        </p>

        <p className="mt-2 text-xs text-gray-500">
          {time}
        </p>

      </div>

    </div>
  );
}