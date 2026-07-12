import AnnouncementList from "./components/AnnouncementList";
import NewAnnouncement from "./components/NewAnnouncement";
import AnnouncementActions from "./components/AnnouncementActions";

export default function AnnouncementsPage() {
  // Sample data (Replace with API data later)
  const announcements = [
    {
      id: 1,
      title: "Assignment Deadline Extension",
      message:
        "Algorithm introduction assignment has been extended by 3 days.",
    },
    {
      id: 2,
      title: "New Video Has Been Uploaded",
      message:
        "Dear students, the remaining modules of Machine Learning have been uploaded. Kindly complete them before the next class.",
    },
  ];

  return (
    <div className="space-y-10">

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Announcements
        </h1>

        <p className="mt-2 text-slate-500">
          Broadcast information to your students.
        </p>
      </div>

      {/* Existing Announcements */}
      <AnnouncementList
        announcements={announcements}
      />

      {/* Create New Announcement */}
      <NewAnnouncement />

      {/* Action Buttons */}
      <AnnouncementActions />

    </div>
  );
}