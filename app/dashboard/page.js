import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../db";
import { tasks } from "../../db/schema";
import { auth } from "../../lib/auth";
import TaskBoard from "./TaskBoard";

async function getQuote() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar la frase");
    }

    const data = await response.json();
    return {
      quote: data.quote,
      author: data.author,
    };
  } catch (error) {
    return {
      quote: "Paso a paso tambien se termina una practica grande.",
      author: "NexoTask",
    };
  }
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, session.user.id))
    .orderBy(desc(tasks.createdAt));

  const quote = await getQuote();

  return (
    <TaskBoard
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
      initialTasks={userTasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }))}
      initialQuote={quote}
    />
  );
}
