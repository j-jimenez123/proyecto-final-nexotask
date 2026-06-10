import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { tasks } from "../../../../db/schema";
import { getCurrentUser } from "../../../../lib/session";
import {
  cleanPriority,
  cleanText,
  isValidDate,
  isValidTime,
  priorities,
} from "../../../../lib/taskRules";

export const runtime = "nodejs";

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
    return NextResponse.json({ error: "Id no válido" }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "JSON no válido" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const changes = {
    updatedAt: new Date(),
  };

  if (typeof body.completed === "boolean") {
    changes.completed = body.completed;
  }

  if (typeof body.title === "string" && body.title.trim()) {
    changes.title = cleanText(body.title, 120);
  }

  if (typeof body.description === "string") {
    changes.description = cleanText(body.description, 500);
  }

  if (typeof body.dueDate === "string") {
    const dueDate = cleanText(body.dueDate, 10);

    if (!isValidDate(dueDate)) {
      return NextResponse.json(
        { error: "La fecha no tiene un formato válido" },
        { status: 400 }
      );
    }

    changes.dueDate = dueDate;
  }

  if (typeof body.dueTime === "string") {
    const dueTime = cleanText(body.dueTime, 5);

    if (!isValidTime(dueTime)) {
      return NextResponse.json(
        { error: "La hora no tiene un formato válido" },
        { status: 400 }
      );
    }

    changes.dueTime = dueTime;
  }

  if (priorities.includes(body.priority)) {
    changes.priority = cleanPriority(body.priority);
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
    return NextResponse.json({ error: "Id no válido" }, { status: 400 });
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
