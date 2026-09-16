"use client";

import { Plus, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { useTasks } from "@/hooks/useTasks";

export function TaskList() {
  const { tasks, loading, error, addTask, completeTask, removeTask } = useTasks();
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || adding) return;
    setAdding(true);
    try {
      await addTask(newTitle.trim());
      setNewTitle("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در اضافه کردن");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Add task form */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b border-border">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="تسک جدید..."
          className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-fg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          disabled={adding}
        />
        <button
          type="submit"
          disabled={!newTitle.trim() || adding}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-accent/90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted">
            <CheckCircle2 className="w-16 h-16 opacity-30 mb-4" />
            <p className="text-lg">هیچ تسکی وجود نداره</p>
            <p className="text-sm mt-1">اولین تسکت رو اضافه کن</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-4 bg-card rounded-lg border ${
                task.completed ? "border-green-500/30" : "border-border"
              } transition-all`}
            >
              <button
                onClick={() => completeTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-border text-muted hover:border-accent hover:text-accent"
                }`}
                disabled={task.completed}
              >
                {task.completed && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </button>
              <span
                className={`flex-1 text-right ${task.completed ? "line-through text-muted" : "text-fg"}`}
              >
                {task.title}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                aria-label="حذف"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}