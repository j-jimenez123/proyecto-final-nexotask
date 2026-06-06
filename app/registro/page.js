"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../auth.module.css";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function registrar(event) {
    event.preventDefault();
    setMensaje("Creando cuenta...");

    const respuesta = await fetch("/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!respuesta.ok) {
      setMensaje("No se ha podido crear la cuenta.");
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
        <h1>Crear cuenta</h1>
        <p>Usa una contrasena de al menos 8 caracteres.</p>

        <form className={styles.form} onSubmit={registrar}>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

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
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Registrarme</button>
        </form>

        {mensaje && <p className={styles.message}>{mensaje}</p>}
        <p className={styles.small}>
          Ya tengo cuenta: <Link href="/login">entrar</Link>
        </p>
      </section>
    </main>
  );
}
