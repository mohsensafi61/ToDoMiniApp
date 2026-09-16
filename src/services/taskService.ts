import { createServiceClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";

export async function getTasks(userId: number): Promise<Task[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("completed", false)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
  return (data ?? []) as Task[];
}

export async function createTask(
  userId: number,
  title: string
): Promise<Task> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(`Failed to create task: ${error.message}`);
  return data as Task;
}

export async function completeTask(
  taskId: string,
  userId: number
): Promise<Task> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed: true })
    .eq("id", taskId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to complete task: ${error.message}`);
  return data as Task;
}

export async function deleteTask(
  taskId: string,
  userId: number
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete task: ${error.message}`);
}
