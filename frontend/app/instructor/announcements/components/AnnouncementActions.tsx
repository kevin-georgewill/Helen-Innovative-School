"use client";

import { Save, SendHorizonal } from "lucide-react";

interface AnnouncementActionsProps {
  onSaveDraft?: () => void;
  onSend?: () => void;
  isSaving?: boolean;
  isSending?: boolean;
}

export default function AnnouncementActions({
  onSaveDraft,
  onSend,
  isSaving = false,
  isSending = false,
}: AnnouncementActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">

      {/* Save Draft */}
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSaving}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-2xl
          border
          border-slate-300
          bg-white
          px-8
          py-4
          text-base
          font-semibold
          text-slate-700
          transition-all
          duration-200
          hover:bg-slate-100
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Save size={20} />

        {isSaving ? "Saving..." : "Save as Draft"}
      </button>

      {/* Send */}
      <button
        type="button"
        onClick={onSend}
        disabled={isSending}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-[#0F2E73]
          px-8
          py-4
          text-base
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-[#0B255C]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <SendHorizonal size={20} />

        {isSending ? "Sending..." : "Send"}
      </button>

    </div>
  );
}