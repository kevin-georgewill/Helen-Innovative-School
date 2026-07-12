"use client";

import { Bell } from "lucide-react";

interface Notification {
  id: number;
  message: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

export default function Notifications({
  notifications,
}: NotificationsProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <Bell className="h-5 w-5 text-blue-700" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Notifications
        </h2>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100"
            >
              <div className="mt-2 h-3 w-3 rounded-full bg-blue-600"></div>

              <p className="text-sm leading-6 text-gray-700">
                {notification.message}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 py-10 text-center">
            <p className="text-gray-500">
              No notifications available.
            </p>
          </div>
        )}
      </div>

    </section>
  );
}