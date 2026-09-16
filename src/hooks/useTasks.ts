"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import type { Task } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { initData, ready } = useTelegramUser();
  const fetchedRef = useRef(false);

  const fetchTasks = useCallback(async () => {
    if (!initData) return;
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
  }, [initData]);

  useEffect(() => {
    if (ready && !fetchedRef.current) {
      fetchedRef.current = true;
      if (initData) {
        fetchTasks();
      } else {
        setLoading(false);
      }
    }
  }, [ready, initData, fetchTasks]);

  const addTask = async (title: string) => {
    if (!initData) return;
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
    if (!initData) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "x-telegram-init-data": initData },
    });
    if (!res.ok) throw new Error("Failed to complete");
    const { task } = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
  };

  const removeTask = async (id: string) => {
    if (!initData) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { "x-telegram-init-data": initData },
    });
    if (!res.ok) throw new Error("Failed to delete");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, addTask, completeTask, removeTask, refetch: fetchTasks };
}
