import Link from "next/link";
import styles from "./page.module.css";

const tareasDemo = [
  {
    titulo: "Terminar practica de Next",
    estado: "Pendiente",
    prioridad: "Alta",
  },
  {
    titulo: "Revisar README",
    estado: "En curso",
    prioridad: "Media",
  },
  {
    titulo: "Preparar despliegue",
    estado: "Completada",
    prioridad: "Baja",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Proyecto final 2 DAW</p>
          <h1>NexoTask</h1>
          <p>
            Gestor de tareas para organizar entregas, practicas y trabajo del
            curso desde un panel sencillo.
          </p>
          <div className={styles.actions}>
            <Link href="/dashboard">Entrar al panel</Link>
            <Link href="/login" className={styles.secondary}>
              Iniciar sesion
            </Link>
          </div>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <span>Hoy</span>
            <strong>3 tareas</strong>
          </div>
          <div className={styles.stats}>
            <article>
              <strong>2</strong>
              <span>Pendientes</span>
            </article>
            <article>
              <strong>1</strong>
              <span>Completada</span>
            </article>
          </div>
          <div className={styles.taskList}>
            {tareasDemo.map((tarea) => (
              <article className={styles.task} key={tarea.titulo}>
                <div>
                  <h2>{tarea.titulo}</h2>
                  <p>{tarea.estado}</p>
                </div>
                <span>{tarea.prioridad}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
