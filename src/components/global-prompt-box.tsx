"use client";

import { useCallback, useRef, useState } from "react";
import {
  PaperclipIcon,
  PlusIcon,
  LightningIcon,
  CaretDownIcon,
  MicrophoneIcon,
  ArrowUpIcon,
  ShieldStarIcon,
  BrainIcon,
  SparkleIcon,
  FolderOpenIcon,
  PlugIcon,
  PhoneIcon,
  CalendarIcon,
  PenIcon,
  XIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getFileIcon } from "@/lib/file-icons";

// ============================================================================
// Shared constants
// ============================================================================

type ModelOption = "auto" | "think" | "fast";

const modelConfig: Record<
  ModelOption,
  { label: string; icon: React.ReactNode }
> = {
  auto: { label: "Auto", icon: <SparkleIcon size={16} /> },
  think: { label: "Think", icon: <BrainIcon size={16} /> },
  fast: { label: "Fast", icon: <LightningIcon size={16} /> },
};

const tools = [
  { label: "Find Files", icon: <FolderOpenIcon size={16} />, href: undefined },
  { label: "Connect Apps", icon: <PlugIcon size={16} />, href: undefined },
  { label: "Call Me", icon: <PhoneIcon size={16} />, href: undefined },
  { label: "Schedule", icon: <CalendarIcon size={16} />, href: undefined },
];

// ============================================================================
// File helpers
// ============================================================================

function truncateFilename(filename: string, maxLen = 20): string {
  const dotIdx = filename.lastIndexOf(".");
  if (dotIdx === -1) {
    if (filename.length <= maxLen) return filename;
    return filename.slice(0, maxLen - 3) + "...";
  }
  const name = filename.slice(0, dotIdx);
  const ext = filename.slice(dotIdx);
  const available = maxLen - ext.length - 3;
  if (name.length + ext.length <= maxLen) return filename;
  if (available < 3) return name.slice(0, 3) + "..." + ext;
  return name.slice(0, available) + "..." + ext;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"]);

function isImageFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS.has(ext);
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  previewUrl?: string;
  file: File;
}

// ============================================================================
// SuggestionSleeves — chips shown above input
// ============================================================================

function SuggestionSleeves({
  suggestions,
  onSuggestionClick,
}: {
  suggestions: string[];
  onSuggestionClick?: (s: string) => void;
}) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 border-b border-border bg-muted/50 px-3 py-2">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSuggestionClick?.(s)}
          className="rounded-lg border border-border bg-background px-2 py-px text-xs text-foreground transition-colors hover:bg-accent active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// GlobalPromptBox
// ============================================================================

interface GlobalPromptBoxProps {
  variant?: "full" | "minimal" | "compact";
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  placeholder?: string;
  suggestions?: string[];
  onSubmit?: (message: { text: string; files: unknown[] }, event: React.FormEvent<HTMLFormElement>) => void;
  onSuggestionClick?: (s: string) => void;
  className?: string;
  hideTools?: boolean;
  hideAvatar?: boolean;
  leadingIcon?: React.ReactNode;
  onLeadingButtonClick?: () => void;
  leadingButtonActive?: boolean;
  leadingButtonLabel?: string;
}

export function GlobalPromptBox({
  variant = "full",
  avatarSrc = "/icon.svg",
  avatarAlt = "Expert",
  avatarFallback = "AI",
  placeholder,
  suggestions = [],
  onSubmit,
  onSuggestionClick,
  className,
  hideTools = false,
  hideAvatar = false,
  leadingIcon,
  onLeadingButtonClick,
  leadingButtonActive = false,
  leadingButtonLabel,
}: GlobalPromptBoxProps) {
  const [chatInput, setChatInput] = useState("");
  const [model, setModel] = useState<ModelOption>("auto");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = modelConfig[model];

  const resolvedPlaceholder =
    placeholder ??
    (variant === "full"
      ? "Upload document, paste text or ask anything..."
      : variant === "compact"
        ? "Type a message..."
        : "Ask anything...");

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected) return;
      const incoming = Array.from(selected);
      setFiles((prev) => {
        const remaining = 10 - prev.length;
        if (remaining <= 0) return prev;
        const newFiles: UploadedFile[] = incoming.slice(0, remaining).map((file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          previewUrl: isImageFile(file.name) ? URL.createObjectURL(file) : undefined,
          file,
        }));
        return [...prev, ...newFiles];
      });
      e.target.value = "";
    },
    []
  );

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const showAvatar = variant !== "compact" && !hideAvatar;
  const showFooter = variant === "full";
  const showSleeves = suggestions.length > 0 && variant === "minimal";
  const hasSleeves = showSleeves;

  return (
    <div className={cn("w-full", className)}>
      {/* Outer wrapper for sleeves + input — focus ring wraps everything */}
      <div
        className={cn(
          "rounded-2xl",
          hasSleeves && "overflow-hidden border border-border shadow-sm",
        )}
      >
      {/* Suggestion sleeves above input */}
      {showSleeves && (
        <SuggestionSleeves
          suggestions={suggestions}
          onSuggestionClick={onSuggestionClick}
        />
      )}

      <PromptInput
        onSubmit={onSubmit ?? (() => void 0)}
        className={cn(
          "w-full",
          "[&_[data-slot=input-group]]:h-auto [&_[data-slot=input-group]]:items-stretch [&_[data-slot=input-group]]:rounded-none [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:overflow-visible [&_[data-slot=input-group]]:ring-0! [&_[data-slot=input-group-addon]]:px-2",
          "bg-background",
          hasSleeves
            ? "rounded-none border-0 shadow-none"
            : "rounded-2xl border border-border shadow-sm",
        )}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* File previews (full variant only) */}
        {variant === "full" && files.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pt-3">
            {files.map((f) =>
              f.previewUrl ? (
                <div
                  key={f.id}
                  className="group/file relative size-16 overflow-hidden rounded-lg border border-border"
                  title={f.name}
                >
                  <img
                    src={f.previewUrl}
                    alt={f.name}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(f.id)}
                    className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover/file:opacity-100"
                    aria-label={`Remove ${f.name}`}
                  >
                    <XIcon size={10} />
                  </button>
                </div>
              ) : (
                <div
                  key={f.id}
                  className="group/file relative flex items-center gap-2 overflow-hidden rounded-lg border border-border bg-muted/50 py-1.5 pl-2 pr-5"
                >
                  <img
                    src={getFileIcon(f.name)}
                    alt=""
                    className="size-6 shrink-0"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-xs font-medium text-foreground" title={f.name}>
                      {truncateFilename(f.name)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatFileSize(f.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(f.id)}
                    className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover/file:opacity-100"
                    aria-label={`Remove ${f.name}`}
                  >
                    <XIcon size={10} />
                  </button>
                </div>
              )
            )}
          </div>
        )}

        <PromptInputBody className="flex w-full items-center gap-2.5 px-2 py-2">
          {variant === "full" && showAvatar ? (
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={avatarSrc} alt={avatarAlt} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          ) : variant !== "full" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onLeadingButtonClick ?? handleUploadClick}
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    leadingButtonActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "animate-pulse-subtle bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                  aria-label={leadingButtonLabel ?? "Attach file"}
                >
                  {leadingIcon ?? <PlusIcon size={16} />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{leadingButtonLabel ?? "Attach file"}</TooltipContent>
            </Tooltip>
          ) : null}
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <PromptInputTextarea
              placeholder={resolvedPlaceholder}
              className={cn(
                "min-w-0 flex-1 border-0 bg-transparent px-0 py-0 pl-2 text-sm leading-snug text-foreground shadow-none ring-0 placeholder:text-muted-foreground",
                variant === "full"
                  ? "min-h-[2lh]"
                  : "min-h-[1lh] max-h-24 resize-none",
              )}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
          </div>
          {/* Inline submit for minimal/compact */}
          {!showFooter && (
            <PromptInputSubmit
              className="size-7 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              size="icon-xs"
              aria-label="Submit"
            >
              <ArrowUpIcon size={14} weight="bold" />
            </PromptInputSubmit>
          )}
        </PromptInputBody>

        {/* Full footer with tools, model selector, voice, submit */}
        {showFooter && (
          <PromptInputFooter className="items-center gap-4 px-2 pb-2 pt-0">
            {!hideTools && (
            <PromptInputTools className="min-w-0 gap-0 overflow-hidden">
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-foreground transition-colors hover:bg-muted active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              >
                <PaperclipIcon size={16} />
                <span className="text-sm leading-snug font-semibold">Upload</span>
              </button>
              {/* Tools and Customize hidden for now */}
            </PromptInputTools>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-muted active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  >
                    <span className="text-primary">{current.icon}</span>
                    <span className="text-sm leading-snug font-semibold text-primary">
                      {current.label}
                    </span>
                    <CaretDownIcon size={14} className="text-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(Object.keys(modelConfig) as ModelOption[]).map((key) => (
                    <DropdownMenuItem
                      key={key}
                      onSelect={() => setModel(key)}
                    >
                      <span className="text-muted-foreground">
                        {modelConfig[key].icon}
                      </span>
                      {modelConfig[key].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded-lg transition-colors hover:bg-muted active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                aria-label="Voice input"
              >
                <MicrophoneIcon size={16} />
              </button>
              <PromptInputSubmit
                className="size-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                size="icon-xs"
                aria-label="Submit"
              >
                <ArrowUpIcon size={14} weight="bold" />
              </PromptInputSubmit>
            </div>
          </PromptInputFooter>
        )}
      </PromptInput>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center justify-center gap-1 pt-2">
        <span className="text-[11px] leading-4 text-muted-foreground">
          Use AI responsibly.
        </span>
        <InfoIcon size={12} className="text-muted-foreground" />
      </div>
    </div>
  );
}
