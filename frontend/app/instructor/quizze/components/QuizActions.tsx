"use client";

import { Save, Send } from "lucide-react";

interface QuizActionsProps {
  onSaveDraft?: () => void;
  onPublish?: () => void;
  isSaving?: boolean;
  isPublishing?: boolean;
}

export default function QuizActions({
  onSaveDraft,
  onPublish,
  isSaving = false,
  isPublishing = false,
}: QuizActionsProps) {
  const isDisabled = isSaving || isPublishing;

  return (
    <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">


      {/* Save Draft */}
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isDisabled}
        aria-label="Save quiz as draft"
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-gray-300
          bg-white
          px-6
          py-3
          text-base
          font-medium
          text-gray-700
          transition-all
          duration-200
          hover:bg-gray-100
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Save size={18} />

        {isSaving ? "Saving..." : "Save as Draft"}

      </button>




      {/* Publish Quiz */}
      <button
        type="button"
        onClick={onPublish}
        disabled={isDisabled}
        aria-label="Publish quiz"
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-900
          px-6
          py-3
          text-base
          font-semibold
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:bg-blue-800
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Send size={18} />

        {isPublishing ? "Publishing..." : "Publish Quiz"}

      </button>


    </div>
  );
}