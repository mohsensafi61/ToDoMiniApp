"use client";

export function useMainButton() {
  return {
    show: (text: string, onClick: () => void) => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.mainButton) return;
      tg.mainButton.show(text);
      tg.mainButton.onClick(onClick);
    },
    hide: () => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.mainButton) return;
      tg.mainButton.hide();
      tg.mainButton.offClick(() => {});
    },
  };
}