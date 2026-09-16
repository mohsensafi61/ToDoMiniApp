"use client";

import { useEffect, useState } from "react";
import { TaskList } from "@/components/TaskList";
import { useTelegramUser } from "@/hooks/useTelegramUser";

export default function HomePage() {
  const { user, ready } = useTelegramUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  if (!mounted || !ready) {
    return (
      <main className="flex flex-col h-screen items-center justify-center">
        <div className="text-muted text-lg">⏳ در حال بارگذاری...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-col h-screen items-center justify-center px-6 text-center">
        <div className="text-4xl mb-4">👋</div>
        <h1 className="text-xl font-bold text-fg mb-2">سلام!</h1>
        <p className="text-muted">
          این اپلیکیشن فقط داخل تلگرام کار می‌کنه.
          <br />
          لطفاً از داخل ربات تلگرام باز کنید.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-screen">
      <header className="px-4 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-fg text-center">📝 تسک‌های من</h1>
        <p className="text-sm text-muted text-center mt-1">
          سلام {user.first_name} 👋
        </p>
      </header>
      <div className="flex-1 overflow-hidden">
        <TaskList />
      </div>
    </main>
  );
}
