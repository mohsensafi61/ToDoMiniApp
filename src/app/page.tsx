"use client";

import { useEffect } from "react";
import { TaskList } from "@/components/TaskList";

export const dynamic = "force-dynamic";

export default function HomePage() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-fg text-center">📝 تسک‌های من</h1>
      </header>

      {/* Task list */}
      <div className="flex-1 overflow-hidden">
        <TaskList />
      </div>
    </main>
  );
}