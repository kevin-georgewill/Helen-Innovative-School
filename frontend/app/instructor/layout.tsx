import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Instructor Dashboard",
  description: "Instructor dashboard for Helen Innovative School",
};

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export default function InstructorLayout({
  children,
}: InstructorLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}