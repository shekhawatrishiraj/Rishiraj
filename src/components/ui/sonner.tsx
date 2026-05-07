"use client"

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerGapIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      closeButton
      richColors
      icons={{
        success: <CheckCircleIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <SpinnerGapIcon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!items-start",
          title: "!text-foreground",
          description: "!text-muted-foreground",
          icon: "!mt-0.5",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--accent)",
          "--success-border": "var(--success)",
          "--success-text": "var(--success)",
          "--error-bg": "var(--accent)",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--destructive)",
          "--warning-bg": "var(--accent)",
          "--warning-border": "var(--warning)",
          "--warning-text": "var(--warning)",
          "--info-bg": "var(--accent)",
          "--info-border": "var(--primary)",
          "--info-text": "var(--primary)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
