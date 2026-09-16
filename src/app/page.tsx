"use client";

import { useState, useEffect } from "react";
import { TaskList } from "@/components/TaskList";
import { useTelegramUser } from "@/hooks/useTelegramUser";

export default function HomePage() {
  const { user, initData, ready } = useTelegramUser();
  const [mounted, setMounted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    // Debug: log everything
    if (tg) {
      const info = {
        initDataRaw: !!tg.initDataRaw,
        initDataRawPreview: tg.initDataRaw?.slice(0, 50),
        initDataUnsafe: tg.initDataUnsafe,
        user: tg.initDataUnsafe?.user,
        colorScheme: tg.colorScheme,
      };
      setDebugInfo(JSON.stringify(info, null, 2));
      console.log("Telegram WebApp Debug:", info);
    } else {
      setDebugInfo("Telegram WebApp NOT FOUND - not inside Telegram");
    }
  }, []);

  if (!mounted) {
    return (
      <main className="flex flex-col h-screen items-center justify-center">
        <div className="text-muted text-lg">⏳ در حال بارگذاری...</div>
      </main>
    );
  }

  if (!initData) {
    return (
      <main className="flex flex-col h-screen items-center justify-center px-4 p-4">
        <div className="text-4xl mb-4">🔧</div>
        <h1 className="text-xl font-bold text-fg mb-2 text-center">Debug Info</h1>
        <pre className="bg-card p-4 rounded-lg text-left text-sm text-muted overflow-auto max-h-[60vh]">
          {debugInfo || "Checking..."}
        </pre>
        <p className="text-center text-muted mt-4 text-sm">
          اگر داخل تلگرام هستید و این متن می‌بینید، یعنی initData ارسال نشده.
          <br />
          بررسی کنید: آدرس در BotFather دقیقاً با Vercel یکی هست؟
        </p>
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