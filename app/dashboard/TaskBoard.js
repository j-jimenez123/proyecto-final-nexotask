"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const filtros = ["todas", "pendientes", "completadas"];

export default function TaskBoard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState(null);
  const [filter, setFilter] = useState("todas");
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "media",
  });

  async function cargarTareas() {
    const response = await fetch("/api/tasks");

    if (!response.ok) {
      setMensaje("No se han podido cargar las tareas.");
      return;
    }

    setTasks(await response.json());
  }

  async function cargarFrase() {
    const response = await fetch("/api/quote");
    const data = await response.json();
    setQuote(data);
  }

  useEffect(() => {
    cargarTareas();
    cargarFrase();
  }, []);

  const resumen = useMemo(() => {
    const total = tasks.length;
    const completadas = tasks.filter((task) => task.completed).length;
    const pendientes = total - completadas;

    return { total, completadas, pendientes };
  }, [tasks]);

  const visibles = tasks.filter((task) => {
    if (filter === "pendientes") return !task.completed;
    if (filter === "completadas") return task.completed;
    return true;
  });

  async function crearTarea(event) {
    event.preventDefault();
    setMensaje("");

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setMensaje("No se ha podido crear la tarea.");
      return;
    }

    setForm({ title: "", description: "", priority: "media" });
    await cargarTareas();
  }

  async function cambiarEstado(task) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !task.completed }),
    });

    await cargarTareas();
  }

  async function borrarTarea(id) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    await cargarTareas();
  }

  async function cerrarSesion() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.brand}>NexoTask</p>
          <h1>Panel de tareas</h1>
          <span>{user.email}</span>
        </div>

        <div className={styles.quote}>
          <strong>Frase del dia</strong>
          <p>{quote?.quote || "Cargando frase..."}</p>
          {quote?.author && <span>{quote.author}</span>}
        </div>

        <button className={styles.logout} onClick={cerrarSesion} type="button">
          Cerrar sesion
        </button>
      </aside>

      <main className={styles.content}>
        <section className={styles.top}>
          <div>
            <p>Hola, {user.name}</p>
            <h2>Organiza lo que tienes pendiente</h2>
          </div>
          <div className={styles.stats}>
            <article>
              <strong>{resumen.total}</strong>
              <span>Total</span>
            </article>
            <article>
              <strong>{resumen.pendientes}</strong>
              <span>Pendientes</span>
            </article>
            <article>
              <strong>{resumen.completadas}</strong>
              <span>Hechas</span>
            </article>
          </div>
        </section>

        <section className={styles.grid}>
          <form className={styles.form} onSubmit={crearTarea}>
            <h3>Nueva tarea</h3>
            <label htmlFor="title">Titulo</label>
            <input
              id="title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Ej: entregar proyecto final"
              required
            />

            <label htmlFor="description">Descripcion</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Notas o detalles de la tarea"
            />

            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              value={form.priority}
              onChange={(event) =>
                setForm({ ...form, priority: event.target.value })
              }
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>

            <button type="submit">Guardar tarea</button>
            {mensaje && <p className={styles.message}>{mensaje}</p>}
          </form>

          <section className={styles.tasks}>
            <div className={styles.filters}>
              {filtros.map((item) => (
                <button
                  className={filter === item ? styles.active : ""}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className={styles.taskList}>
              {visibles.length === 0 ? (
                <article className={styles.empty}>
                  No hay tareas en este filtro.
                </article>
              ) : (
                visibles.map((task) => (
                  <article
                    className={`${styles.task} ${
                      task.completed ? styles.done : ""
                    }`}
                    key={task.id}
                  >
                    <div className={styles.taskMain}>
                      <button
                        className={styles.check}
                        onClick={() => cambiarEstado(task)}
                        type="button"
                      >
                        {task.completed ? "✓" : ""}
                      </button>
                      <div>
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                        <span>
                          {new Date(task.createdAt).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                    <div className={styles.taskActions}>
                      <span className={styles[task.priority]}>
                        {task.priority}
                      </span>
                      <button onClick={() => borrarTarea(task.id)} type="button">
                        Borrar
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
