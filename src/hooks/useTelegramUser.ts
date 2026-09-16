"use client";

import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataRaw?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
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
  const [ready, setReady] = useState(false);
  const attemptsRef = useRef(0);

  useEffect(() => {
    function checkTelegram() {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        if (tg.initDataRaw) setInitData(tg.initDataRaw);
        if (tg.initDataUnsafe?.user) {
          const u = tg.initDataUnsafe.user;
          setUser({
            id: u.id,
            first_name: u.first_name,
            username: u.username,
          });
        }
        setReady(true);
        return;
      }

      // Telegram script might not have loaded yet — retry
      attemptsRef.current++;
      if (attemptsRef.current < 20) {
        setTimeout(checkTelegram, 300);
      } else {
        // Gave up — not in Telegram or script never loaded
        setReady(true);
      }
    }

    checkTelegram();
  }, []);

  return { initData, user, ready };
}