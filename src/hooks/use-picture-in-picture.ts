"use client";

import { useState, useCallback, useEffect } from "react";

interface UsePictureInPictureOptions {
  width?: number;
  height?: number;
}

interface DocumentPictureInPictureWindow extends Window {
  // PiP window is just a Window
}

interface DocumentPictureInPicture {
  requestWindow(options?: {
    width?: number;
    height?: number;
  }): Promise<DocumentPictureInPictureWindow>;
  window: DocumentPictureInPictureWindow | null;
}

declare global {
  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture;
  }
}

export function copyStylesheets(source: Document, target: Document) {
  // Copy <link> stylesheets
  for (const link of Array.from(source.querySelectorAll('link[rel="stylesheet"]'))) {
    target.head.appendChild(link.cloneNode(true));
  }

  // Copy inline <style> tags
  for (const style of Array.from(source.querySelectorAll("style"))) {
    target.head.appendChild(style.cloneNode(true));
  }

  // Copy adopted stylesheets (CSS-in-JS, Tailwind runtime, etc.)
  try {
    for (const sheet of source.styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules)
          .map((r) => r.cssText)
          .join("\n");
        const newStyle = target.createElement("style");
        newStyle.textContent = rules;
        target.head.appendChild(newStyle);
      } catch {
        // Cross-origin sheet — skip (already handled via <link> clone above)
      }
    }
  } catch {
    // styleSheets access denied
  }
}

export function usePictureInPicture({
  width = 414,
  height = 866,
}: UsePictureInPictureOptions = {}) {
  // On mount, adopt any existing PiP window (e.g. opened before navigation)
  const [pipWindow, setPipWindow] = useState<Window | null>(() => {
    if (typeof window !== "undefined" && window.documentPictureInPicture?.window) {
      return window.documentPictureInPicture.window;
    }
    return null;
  });

  const isSupported =
    typeof window !== "undefined" && "documentPictureInPicture" in window;

  // Wire up pagehide listener whenever pipWindow changes
  useEffect(() => {
    if (!pipWindow) return;
    const handleHide = () => setPipWindow(null);
    pipWindow.addEventListener("pagehide", handleHide);
    return () => pipWindow.removeEventListener("pagehide", handleHide);
  }, [pipWindow]);

  const open = useCallback(async () => {
    if (!isSupported) return null;

    const pip = await window.documentPictureInPicture!.requestWindow({
      width,
      height,
    });

    copyStylesheets(document, pip.document);

    setPipWindow(pip);
    return pip;
  }, [isSupported, width, height]);

  const close = useCallback(() => {
    pipWindow?.close();
    setPipWindow(null);
  }, [pipWindow]);

  return {
    pipWindow,
    isOpen: !!pipWindow,
    isSupported,
    open,
    close,
  };
}
