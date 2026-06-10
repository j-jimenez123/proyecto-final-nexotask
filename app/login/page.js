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
      setMensaje("No se ha podido iniciar sesión. Si la cuenta era anterior al último despliegue, vuelve a registrarte.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const frases = [
    "Divide el día en tareas pequeñas.",
    "Primero lo importante, después lo urgente.",
    "Una tarea terminada vale más que diez apuntadas.",
  ];

  const logros = [
    "Objetivo desbloqueado",
    "Entrega lista",
    "Día bien organizado",
    "Constancia antes que prisa",
  ];

  return (
    <main className={`${styles.page} ${styles.loginPage}`}>
      <header className={styles.loginHeader}>
        <Link href="/" className={styles.loginLogo}>
          <span>N</span>
          <strong>NEXO TASK</strong>
          <small>organiza tu día</small>
        </Link>
      </header>

      <section className={styles.loginDecor} aria-hidden="true">
        <div className={`${styles.floatScene} ${styles.calendarScene}`}>
          <span className={styles.sceneLabel}>Semana</span>
          <div className={styles.calendarGrid}>
            <span>L</span>
            <span>M</span>
            <span>X</span>
            <span>J</span>
            <span>V</span>
            <strong>8</strong>
            <strong>9</strong>
            <strong>10</strong>
            <strong>11</strong>
            <strong>12</strong>
          </div>
        </div>

        <div className={`${styles.floatScene} ${styles.focusScene}`}>
          <span className={styles.sceneLabel}>Enfoque</span>
          <strong>25:00</strong>
          <p>modo concentración</p>
        </div>

        <div className={`${styles.floatScene} ${styles.successScene}`}>
          <span className={styles.donePulse}>OK</span>
          <div>
            <strong>3 tareas hechas</strong>
            <p>vas pillando ritmo</p>
          </div>
        </div>

        <div className={`${styles.floatScene} ${styles.priorityScene}`}>
          <span>Alta</span>
          <span>Media</span>
          <span>Baja</span>
        </div>
      </section>

      <section className={styles.successPhrases} aria-hidden="true">
        {logros.map((logro, index) => (
          <span key={logro} style={{ "--phrase-delay": `${index * 1.1}s` }}>
            {logro}
          </span>
        ))}
      </section>

      <section className={`${styles.panel} ${styles.loginPanel}`}>
        <h1>Iniciar sesión</h1>
        <p>Entra y deja preparado lo que toca hacer hoy.</p>

        <form className={styles.form} onSubmit={entrar}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
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

      <section className={styles.loginVisual} aria-label="Vista previa de NexoTask">
        <div className={styles.videoCard}>
          <div className={styles.videoTop}>
            <span />
            <span />
            <span />
            <strong>Plan de hoy</strong>
          </div>

          <div className={styles.taskMovie}>
            <div className={`${styles.movieTask} ${styles.movieTaskOne}`}>
              <span className={styles.checkCircle}>OK</span>
              <div>
                <strong>Repasar proyecto final</strong>
                <p>09:30 - prioridad alta</p>
              </div>
            </div>
            <div className={`${styles.movieTask} ${styles.movieTaskTwo}`}>
              <span className={styles.timePill}>11:00</span>
              <div>
                <strong>Subir cambios a GitHub</strong>
                <p>README, commits y pruebas</p>
              </div>
            </div>
            <div className={`${styles.movieTask} ${styles.movieTaskThree}`}>
              <span className={styles.spark}>+</span>
              <div>
                <strong>Nueva tarea guardada</strong>
                <p>Sin perder lo que ya está hecho</p>
              </div>
            </div>
          </div>

          <div className={styles.progressBlock}>
            <div>
              <strong>68%</strong>
              <p>avance del día</p>
            </div>
            <span className={styles.progressLine}>
              <span />
            </span>
          </div>
        </div>

        <div className={styles.phraseStack}>
          {frases.map((frase, index) => (
            <p key={frase} style={{ "--delay": `${index * 0.35}s` }}>
              {frase}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
