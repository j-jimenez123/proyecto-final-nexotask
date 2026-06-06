import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { tasks } from "../../../../db/schema";
import { getCurrentUser } from "../../../../lib/session";

export const runtime = "nodejs";

const prioridades = ["baja", "media", "alta"];

function getId(params) {
  const id = Number(params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = getId(await params);

  if (!id) {
    return NextResponse.json({ error: "Id no valido" }, { status: 400 });
  }

  const body = await request.json();
  const changes = {
    updatedAt: new Date(),
  };

  if (typeof body.completed === "boolean") {
    changes.completed = body.completed;
  }

  if (typeof body.title === "string" && body.title.trim()) {
    changes.title = body.title.trim().slice(0, 120);
  }

  if (typeof body.description === "string") {
    changes.description = body.description.trim();
  }

  if (prioridades.includes(body.priority)) {
    changes.priority = body.priority;
  }

  const result = await db
    .update(tasks)
    .set(changes)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
    .returning();

  if (!result[0]) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}

export async function DELETE(_request, { params }) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = getId(await params);

  if (!id) {
    return NextResponse.json({ error: "Id no valido" }, { status: 400 });
  }

  const result = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
    .returning();

  if (!result[0]) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
