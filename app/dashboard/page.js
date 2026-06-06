import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div>
          <p>NexoTask</p>
          <h1>Hola, {session.user.name}</h1>
          <span>{session.user.email}</span>
        </div>
      </section>
    </main>
  );
}
