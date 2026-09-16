import { NextRequest, NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram";
import { getTasks, createTask } from "@/services/taskService";

function extractUserId(request: NextRequest): number | null {
  const initData = request.headers.get("x-telegram-init-data");
  if (!initData) return null;

  const result = validateTelegramInitData(initData);
  return result.valid ? (result.userId ?? null) : null;
}

/** GET /api/tasks — list tasks */
export async function GET(request: NextRequest) {
  const userId = extractUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tasks = await getTasks(userId);
    return NextResponse.json({ tasks });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/tasks — create task */
export async function POST(request: NextRequest) {
  const userId = extractUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title } = await request.json();
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await createTask(userId, title.trim());
    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
