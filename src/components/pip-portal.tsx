"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface PipPortalProps {
  pipWindow: Window;
  children: React.ReactNode;
}

export function PipPortal({ pipWindow, children }: PipPortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = pipWindow.document.createElement("div");
    el.id = "pip-root";
    el.style.height = "100%";
    pipWindow.document.body.appendChild(el);
    setContainer(el);
    return () => el.remove();
  }, [pipWindow]);

  if (!container) return null;
  return createPortal(children, container);
}
