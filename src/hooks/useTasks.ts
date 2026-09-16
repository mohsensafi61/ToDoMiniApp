"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import type { Task } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { initData } = useTelegramUser();

  // Only create client in browser
  const supabase = typeof window !== "undefined" ? createBrowserClient() : null;

  const fetchTasks = useCallback(async () => {
    if (!initData || !supabase) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tasks", {
        headers: { "x-telegram-init-data": initData },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const { tasks: data } = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [initData, supabase]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string) => {
    if (!initData || !supabase) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-telegram-init-data": initData },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to add");
    const { task } = await res.json();
    setTasks((prev) => [task, ...prev]);
  };

  const completeTask = async (id: string) => {
    if (!initData || !supabase) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "x-telegram-init-data": initData },
    });
    if (!res.ok) throw new Error("Failed to complete");
    const { task } = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
  };

  const removeTask = async (id: string) => {
    if (!initData || !supabase) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { "x-telegram-init-data": initData },
    });
    if (!res.ok) throw new Error("Failed to delete");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, addTask, completeTask, removeTask, refetch: fetchTasks };
}