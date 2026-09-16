"use client";

import { useEffect } from "react";

export function BackButton({ onClick }: { onClick: () => void }) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.backButton) return;

    tg.backButton.show();
    tg.backButton.onClick(onClick);
    return () => {
      tg.backButton.offClick(onClick);
      tg.backButton.hide();
    };
  }, [onClick]);

  return null;
}