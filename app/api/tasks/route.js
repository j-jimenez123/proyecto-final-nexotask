import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../db";
import { tasks } from "../../../db/schema";
import { getCurrentUser } from "../../../lib/session";
import { cleanTaskInput } from "../../../lib/taskRules";

export const runtime = "nodejs";

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

  let body;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "JSON no válido" }, { status: 400 });
  }

  const { task, error } = cleanTaskInput(body);

  if (error) {
    return NextResponse.json(
      { error },
      { status: 400 }
    );
  }

  const now = new Date();
  const result = await db
    .insert(tasks)
    .values({
      ...task,
      completed: false,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}
