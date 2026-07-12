"use client";

import { useState } from "react";

interface NewAnnouncementProps {
  onTitleChange?: (title: string) => void;
  onMessageChange?: (message: string) => void;
}

export default function NewAnnouncement({
  onTitleChange,
  onMessageChange,
}: NewAnnouncementProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(e.target.value);
    onTitleChange?.(e.target.value);
  };

  const handleMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value);
    onMessageChange?.(e.target.value);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      {/* Heading */}
      <h2 className="mb-8 text-3xl font-bold text-slate-900">
        New Announcement
      </h2>

      {/* Title */}
      <div className="mb-6">

        <label
          htmlFor="announcement-title"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Title
        </label>

        <input
          id="announcement-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter announcement title"
          className="
            w-full
            rounded-2xl
            border
            border-gray-300
            px-5
            py-4
            text-base
            outline-none
            transition
            focus:border-[#0F2E73]
            focus:ring-2
            focus:ring-blue-100
          "
        />

      </div>

      {/* Message */}
      <div>

        <label
          htmlFor="announcement-message"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Message
        </label>

        <textarea
          id="announcement-message"
          rows={8}
          value={message}
          onChange={handleMessageChange}
          placeholder="Write your announcement..."
          className="
            w-full
            resize-none
            rounded-2xl
            border
            border-gray-300
            px-5
            py-4
            text-base
            outline-none
            transition
            focus:border-[#0F2E73]
            focus:ring-2
            focus:ring-blue-100
          "
        />

      </div>

    </section>
  );
}