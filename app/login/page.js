"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function entrar(event) {
    event.preventDefault();
    setMensaje("Entrando...");

    const respuesta = await fetch("/api/auth/sign-in/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!respuesta.ok) {
      setMensaje("No se ha podido iniciar sesion.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <Link href="/" className={styles.back}>
          NexoTask
        </Link>
        <h1>Iniciar sesion</h1>
        <p>Entra para ver tus tareas y el panel privado.</p>

        <form className={styles.form} onSubmit={entrar}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Contrasena</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        {mensaje && <p className={styles.message}>{mensaje}</p>}
        <p className={styles.small}>
          No tengo cuenta: <Link href="/registro">registrarme</Link>
        </p>
      </section>
    </main>
  );
}
