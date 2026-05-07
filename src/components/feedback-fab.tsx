"use client";

import { ChatCircleDotsIcon } from "@phosphor-icons/react";

const FEEDBACK_FORM_URL = "https://forms.gle/YOUR_FORM_ID";

export function FeedbackFab() {
  return (
    <a
      href={FEEDBACK_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center gap-2 rounded-full bg-neutral-800 pl-2.5 pr-2.5 shadow-md transition-[width,padding,box-shadow] duration-200 ease-out hover:w-auto hover:pr-4 hover:shadow-lg"
    >
      <ChatCircleDotsIcon
        weight="duotone"
        className="size-5 shrink-0 text-white"
      />
      <span className="inline-grid grid-cols-[0fr] overflow-hidden text-sm font-medium text-white transition-[grid-template-columns,opacity] duration-200 ease-out group-hover:grid-cols-[1fr] group-hover:opacity-100 opacity-0">
        <span className="min-w-0 overflow-hidden whitespace-nowrap">
          Feedback
        </span>
      </span>
    </a>
  );
}
