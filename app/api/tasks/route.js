import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../db";
import { tasks } from "../../../db/schema";
import { getCurrentUser } from "../../../lib/session";

export const runtime = "nodejs";

const prioridades = ["baja", "media", "alta"];

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, user.id))
    .orderBy(desc(tasks.createdAt));

  return NextResponse.json(userTasks);
}

export async function POST(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const priority = prioridades.includes(body.priority) ? body.priority : "media";

  if (!title || title.length > 120) {
    return NextResponse.json(
      { error: "El titulo es obligatorio" },
      { status: 400 }
    );
  }

  const now = new Date();
  const result = await db
    .insert(tasks)
    .values({
      title,
      description,
      priority,
      completed: false,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}
