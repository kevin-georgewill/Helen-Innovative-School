"use client";

import AnnouncementCard from "./AnnouncementCard";

interface Announcement {
  id: number;
  title: string;
  message: string;
}

interface AnnouncementListProps {
  announcements: Announcement[];
}

export default function AnnouncementList({
  announcements,
}: AnnouncementListProps) {
  return (
    <section className="space-y-6">
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            title={announcement.title}
            message={announcement.message}
          />
        ))
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white py-16 text-center">
          <h3 className="text-xl font-semibold text-slate-700">
            No Announcements Yet
          </h3>

          <p className="mt-2 text-slate-500">
            Create your first announcement to notify your students.
          </p>
        </div>
      )}
    </section>
  );
}