import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import TaskBoard from "./TaskBoard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <TaskBoard
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    />
  );
}
