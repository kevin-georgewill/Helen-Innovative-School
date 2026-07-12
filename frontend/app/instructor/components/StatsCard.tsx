import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        {/* Text */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`${iconColor} h-7 w-7`} />
        </div>
      </div>
    </div>
  );
}