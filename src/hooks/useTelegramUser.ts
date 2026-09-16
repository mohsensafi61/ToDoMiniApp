"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataRaw?: string;
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
        };
        expand: () => void;
        ready: () => void;
        close: () => void;
        colorScheme: string;
        themeParams: Record<string, string>;
        backButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        mainButton: {
          show: (text: string) => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
      };
    };
  }
}

export function useTelegramUser() {
  const [initData, setInitData] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; first_name: string; username?: string } | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.initDataRaw) setInitData(tg.initDataRaw);
      if (tg.user) {
        setUser({
          id: tg.user.id,
          first_name: tg.user.first_name,
          username: tg.user.username,
        });
      }
    }
  }, []);

  return { initData, user };
}
