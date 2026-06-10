import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../db";
import { tasks } from "../../db/schema";
import { auth } from "../../lib/auth";
import { getMotivationQuote } from "../../lib/quotes";
import TaskBoard from "./TaskBoard";

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

  const quote = await getMotivationQuote();

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
