"use client";

import { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface RecentChat {
  title: string;
  time: string;
}

interface ChatSuggestionsProps {
  recentChats: RecentChat[];
  suggestions: string[];
  onChatClick?: (chat: RecentChat) => void;
  onSuggestionClick?: (suggestion: string) => void;
  onShowMore?: () => void;
  className?: string;
}

const MAX_VISIBLE = 5;

export function ChatSuggestions({
  recentChats,
  suggestions,
  onChatClick,
  onSuggestionClick,
  onShowMore,
  className,
}: ChatSuggestionsProps) {
  const [expanded, setExpanded] = useState(false);

  const totalItems = recentChats.length + suggestions.length;
  const hasOverflow = totalItems > MAX_VISIBLE;

  // Show chats first, then suggestions, capped at MAX_VISIBLE when collapsed
  const visibleChats = expanded
    ? recentChats
    : recentChats.slice(0, MAX_VISIBLE);
  const remainingSlots = Math.max(0, MAX_VISIBLE - visibleChats.length);
  const visibleSuggestions = expanded
    ? suggestions
    : suggestions.slice(0, remainingSlots);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-xs leading-5 text-muted-foreground">
          Recent Chats
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      {/* Items */}
      <div className="flex flex-col">
        {visibleChats.map((chat) => (
          <button
            key={chat.title}
            onClick={() => onChatClick?.(chat)}
            className="group/chat flex items-center justify-between gap-2 bg-background px-1.5 py-1.5 text-left transition-colors hover:bg-accent"
          >
            <span className="truncate text-sm leading-[22px] text-foreground">
              {chat.title}
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {chat.time}
            </span>
          </button>
        ))}
        {visibleSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick?.(suggestion)}
            className="flex items-center gap-2 bg-background px-1.5 py-1.5 text-left transition-colors hover:bg-accent"
          >
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
              Try
            </span>
            <span className="text-sm leading-[22px] text-foreground">
              {suggestion}
            </span>
          </button>
        ))}
      </div>
      {/* Show More / Show Less */}
      {hasOverflow && (
        <button
          onClick={() => {
            setExpanded((v) => !v);
            if (!expanded) onShowMore?.();
          }}
          className="flex items-center gap-1 pt-0.5"
        >
          <span className="text-xs leading-5 text-muted-foreground">
            {expanded ? "Show Less" : "Show More"}
          </span>
          {expanded ? (
            <CaretUpIcon size={16} className="text-muted-foreground/60" />
          ) : (
            <CaretDownIcon size={16} className="text-muted-foreground/60" />
          )}
        </button>
      )}
    </div>
  );
}
