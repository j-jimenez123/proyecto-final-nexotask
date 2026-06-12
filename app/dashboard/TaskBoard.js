"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

const filtros = ["todas", "pendientes", "completadas"];
const labels = {
  todas: "Todas",
  pendientes: "Pendientes",
  completadas: "Completadas",
};
const viewLabels = {
  bandeja: "Bandeja",
  hoy: "Hoy",
  proximas: "Próximas",
  urgentes: "Urgentes",
  vencidas: "Vencidas",
  completadas: "Hechas",
};
const priorityOrder = {
  alta: 1,
  media: 2,
  baja: 3,
};

function getToday() {
  return formatInputDate(new Date());
}

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return formatInputDate(date);
}

function formatInputDate(date) {
  if (!isValidDateObject(date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidDateObject(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function isInputDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;

  const date = parseInputDate(value);
  return Boolean(date && !Number.isNaN(date.getTime()));
}

function formatDate(value) {
  if (!isInputDate(value)) return "Sin fecha";

  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function parseInputDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return null;
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getMonthLabel(date) {
  if (!isValidDateObject(date)) return "Mes sin seleccionar";

  return date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

function isOverdue(task) {
  return Boolean(task.dueDate && task.dueDate < getToday() && !task.completed);
}

export default function TaskBoard({ user, initialTasks, initialQuote }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [quote] = useState(initialQuote);
  const [activeView, setActiveView] = useState("bandeja");
  const [filter, setFilter] = useState("todas");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [dateFilter, setDateFilter] = useState("todas");
  const [sortMode, setSortMode] = useState("fecha");
  const [tasksOpen, setTasksOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState("tareas");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [notice, setNotice] = useState("");
  const [working, setWorking] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarModalDay, setCalendarModalDay] = useState(null);
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "media",
    dueDate: getToday(),
    dueTime: "",
  });

  async function cargarTareas() {
    const response = await fetch("/api/tasks");

    if (!response.ok) {
      setMensaje("No se han podido cargar las tareas.");
      return;
    }

    setTasks(await response.json());
  }

  const resumen = useMemo(() => {
    const total = tasks.length;
    const completadas = tasks.filter((task) => task.completed).length;
    const pendientes = total - completadas;
    const progreso = total === 0 ? 0 : Math.round((completadas / total) * 100);
    const hoy = getToday();
    const manana = getTomorrow();

    return {
      total,
      completadas,
      pendientes,
      progreso,
      hoy: tasks.filter((task) => task.dueDate === hoy).length,
      manana: tasks.filter((task) => task.dueDate === manana).length,
      alta: tasks.filter((task) => task.priority === "alta" && !task.completed)
        .length,
      vencidas: tasks.filter((task) => isOverdue(task)).length,
    };
  }, [tasks]);

  const visibles = tasks.filter((task) => {
    const statusOk =
      filter === "pendientes"
        ? !task.completed
        : filter === "completadas"
          ? task.completed
          : true;
    const priorityOk =
      priorityFilter === "todas" ? true : task.priority === priorityFilter;
    const dateOk =
      dateFilter === "hoy"
        ? task.dueDate === getToday()
        : dateFilter === "manana"
          ? task.dueDate === getTomorrow()
          : dateFilter === "vencidas"
            ? isOverdue(task)
            : dateFilter === "sin-fecha"
              ? !task.dueDate
              : true;
    const text = `${task.title} ${task.description}`.toLowerCase();
    const searchOk = text.includes(search.toLowerCase().trim());

    return statusOk && priorityOk && dateOk && searchOk;
  }).sort((a, b) => {
    if (sortMode === "prioridad") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    if (sortMode === "recientes") {
      return b.id - a.id;
    }

    const dateA = `${a.dueDate || "9999-12-31"} ${a.dueTime || "99:99"}`;
    const dateB = `${b.dueDate || "9999-12-31"} ${b.dueTime || "99:99"}`;
    return dateA.localeCompare(dateB);
  });

  const proximas = useMemo(() => {
    return tasks
      .filter((task) => !task.completed)
      .sort((a, b) => {
        const dateA = `${a.dueDate || "9999-12-31"} ${a.dueTime || "99:99"}`;
        const dateB = `${b.dueDate || "9999-12-31"} ${b.dueTime || "99:99"}`;
        return dateA.localeCompare(dateB);
      })
      .slice(0, 5);
  }, [tasks]);

  const siguiente = useMemo(() => {
    return tasks
      .filter((task) => !task.completed)
      .sort((a, b) => {
        const overdueA = isOverdue(a) ? 0 : 1;
        const overdueB = isOverdue(b) ? 0 : 1;

        if (overdueA !== overdueB) return overdueA - overdueB;

        const priorityA = priorityOrder[a.priority] || 4;
        const priorityB = priorityOrder[b.priority] || 4;

        if (priorityA !== priorityB) return priorityA - priorityB;

        const dateA = `${a.dueDate || "9999-12-31"} ${a.dueTime || "99:99"}`;
        const dateB = `${b.dueDate || "9999-12-31"} ${b.dueTime || "99:99"}`;
        return dateA.localeCompare(dateB);
      })[0];
  }, [tasks]);

  const emptyMessage =
    activeView === "hoy"
      ? "No tienes tareas para hoy. Puedes crear una nueva o adelantar algo pendiente."
      : activeView === "urgentes"
        ? "No hay tareas urgentes ahora mismo. Buen momento para avanzar con calma."
        : activeView === "completadas"
          ? "Todavía no hay tareas hechas en esta vista."
          : search
            ? "No hay coincidencias con esa busqueda."
            : "No hay tareas en este filtro.";

  const calendarDays = useMemo(() => {
    const today = new Date();
    const safeCursor = isValidDateObject(calendarCursor)
      ? calendarCursor
      : new Date(today.getFullYear(), today.getMonth(), 1);
    const year = safeCursor.getFullYear();
    const month = safeCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekDay = (firstDay.getDay() + 6) % 7;

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(year, month, 1 - firstWeekDay + index);
      const value = formatInputDate(date);
      const dayTasks = tasks
        .filter((task) => task.dueDate === value && !task.completed)
        .sort((a, b) => `${a.dueTime || "99:99"}`.localeCompare(b.dueTime || "99:99"));

      return {
        value,
        day: date.getDate(),
        currentMonth: date.getMonth() === month,
        today: value === getToday(),
        selected: value === form.dueDate,
        tasks: dayTasks.length,
        previewTasks: dayTasks.slice(0, 3),
      };
    });
  }, [calendarCursor, form.dueDate, tasks]);

  const modalTasks = calendarModalDay
    ? tasks
        .filter((task) => task.dueDate === calendarModalDay && !task.completed)
        .sort((a, b) =>
          `${a.dueTime || "99:99"}`.localeCompare(b.dueTime || "99:99")
        )
    : [];

  const vistas = [
    { id: "bandeja", label: "Bandeja", symbol: "📥", count: resumen.total },
    { id: "hoy", label: "Hoy", symbol: "💡", count: resumen.hoy },
    { id: "proximas", label: "Próximas", symbol: "📅", count: resumen.pendientes },
    { id: "urgentes", label: "Urgentes", symbol: "⚡", count: resumen.alta },
    { id: "vencidas", label: "Vencidas", symbol: "!", count: resumen.vencidas },
    { id: "completadas", label: "Hechas", symbol: "✅", count: resumen.completadas },
  ];

  function cambiarVista(view) {
    setActiveView(view);
    setSearch("");
    setSortMode("fecha");
    setTasksOpen(true);
    setOpenPanel("tareas");

    if (view === "bandeja") {
      setFilter("todas");
      setDateFilter("todas");
      setPriorityFilter("todas");
    }

    if (view === "hoy") {
      setFilter("todas");
      setDateFilter("hoy");
      setPriorityFilter("todas");
    }

    if (view === "proximas") {
      setFilter("pendientes");
      setDateFilter("todas");
      setPriorityFilter("todas");
    }

    if (view === "urgentes") {
      setFilter("pendientes");
      setDateFilter("todas");
      setPriorityFilter("alta");
    }

    if (view === "vencidas") {
      setFilter("pendientes");
      setDateFilter("vencidas");
      setPriorityFilter("todas");
    }

    if (view === "completadas") {
      setFilter("completadas");
      setDateFilter("todas");
      setPriorityFilter("todas");
    }
  }

  async function crearTarea(event) {
    event.preventDefault();
    setMensaje("");
    setNotice("");
    setWorking("crear");

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setMensaje("No se ha podido crear la tarea.");
      setWorking("");
      return;
    }

    setForm({
      title: "",
      description: "",
      priority: "media",
      dueDate: getToday(),
      dueTime: "",
    });
    await cargarTareas();
    setNotice("Tarea creada correctamente.");
    setWorking("");
  }

  async function cambiarEstado(task) {
    setWorking(`estado-${task.id}`);

    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !task.completed }),
    });

    await cargarTareas();
    setNotice(task.completed ? "Tarea marcada como pendiente." : "Tarea completada.");
    setWorking("");
  }

  async function borrarTarea(id) {
    const confirmacion = window.confirm("¿Seguro que quieres borrar esta tarea?");

    if (!confirmacion) return;

    setWorking(`borrar-${id}`);

    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    await cargarTareas();
    setNotice("Tarea eliminada.");
    setWorking("");
  }

  function empezarEdicion(task) {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate || getToday(),
      dueTime: task.dueTime || "",
    });
  }

  async function guardarEdicion(event) {
    event.preventDefault();
    setWorking("editar");

    await fetch(`/api/tasks/${editingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });

    setEditingId(null);
    setEditForm(null);
    await cargarTareas();
    setNotice("Tarea actualizada.");
    setWorking("");
  }

  async function borrarCompletadas() {
    const completadas = tasks.filter((task) => task.completed);

    if (completadas.length === 0) return;

    const confirmacion = window.confirm(
      `Vas a borrar ${completadas.length} tarea${
        completadas.length === 1 ? "" : "s"
      } hecha${completadas.length === 1 ? "" : "s"}.`
    );

    if (!confirmacion) return;

    setWorking("limpiar");

    await Promise.all(
      completadas.map((task) =>
        fetch(`/api/tasks/${task.id}`, {
          method: "DELETE",
        })
      )
    );

    await cargarTareas();
    setNotice("Tareas completadas eliminadas.");
    setWorking("");
  }

  function limpiarFormulario() {
    setForm({
      title: "",
      description: "",
      priority: "media",
      dueDate: getToday(),
      dueTime: "",
    });
    setMensaje("");
  }

  function usarPlantilla(tipo) {
    const plantilla = {
      entrega: {
        title: "Revisar entrega",
        description: "Comprobar requisitos, pruebas y README antes de subir.",
        priority: "alta",
        dueDate: getToday(),
        dueTime: "18:00",
      },
      estudio: {
        title: "Bloque de estudio",
        description: "Repasar apuntes y dejar dudas anotadas.",
        priority: "media",
        dueDate: getToday(),
        dueTime: "17:00",
      },
      recordatorio: {
        title: "Recordatorio rapido",
        description: "",
        priority: "baja",
        dueDate: getTomorrow(),
        dueTime: "",
      },
    };

    setForm(plantilla[tipo]);
    setOpenPanel("crear");
    setTasksOpen(true);
    setNotice("Plantilla preparada. Revisa los datos y guárdala.");
  }

  function moverMes(direction) {
    const today = new Date();
    const safeCursor = isValidDateObject(calendarCursor)
      ? calendarCursor
      : new Date(today.getFullYear(), today.getMonth(), 1);

    setCalendarCursor(
      new Date(
        safeCursor.getFullYear(),
        safeCursor.getMonth() + direction,
        1
      )
    );
  }

  function seleccionarFecha(value) {
    setForm({ ...form, dueDate: value });

    if (!isInputDate(value)) {
      setCalendarOpen(false);
      return;
    }

    const selected = parseInputDate(value);
    setCalendarCursor(new Date(selected.getFullYear(), selected.getMonth(), 1));
    setCalendarOpen(false);
  }

  function abrirDiaCalendario(day) {
    setForm({ ...form, dueDate: day.value });

    if (day.tasks > 0) {
      setCalendarModalDay(day.value);
      return;
    }

    seleccionarFecha(day.value);
  }

  function abrirZona(id, panel) {
    setOpenPanel(panel);
    setTasksOpen(true);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function abrirPanelPrincipal() {
    setTasksOpen(false);
    setSearch("");
    setFilter("todas");
    setDateFilter("todas");
    setPriorityFilter("todas");
  }

  async function cerrarSesion() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className={styles.shell}>
      {notice && (
        <button
          className={styles.toast}
          onClick={() => setNotice("")}
          type="button"
        >
          <strong>Listo</strong>
          <span>{notice}</span>
        </button>
      )}

      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <div className={styles.logoRow}>
            <div className={styles.logo}>N</div>
            <div>
              <p className={styles.brand}>NexoTask</p>
              <span>{user.email}</span>
            </div>
          </div>

          <nav className={styles.nav}>
            {vistas.map((item) => (
              <button
                className={activeView === item.id ? styles.navActive : ""}
                key={item.id}
                onClick={() => cambiarVista(item.id)}
                type="button"
              >
                <span className={styles.navSymbol}>{item.symbol}</span>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </button>
            ))}
          </nav>

          <div className={styles.quickSearch}>
            <label htmlFor="search">Buscar</label>
            <input
              id="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setTasksOpen(true);
                setOpenPanel("tareas");
              }}
              placeholder="Nombre o descripción"
            />
          </div>

          <div className={styles.sideActions}>
            <button onClick={abrirPanelPrincipal} type="button">
              Vista general
            </button>
            <button onClick={() => abrirZona("crear-tarea", "crear")} type="button">
              + Nueva tarea
            </button>
          </div>
        </div>

        <div className={styles.quote}>
          <strong>Frase de enfoque</strong>
          <p>{quote?.quote || "Frase no disponible."}</p>
          {quote?.author && <span>{quote.author}</span>}
        </div>

        <div className={styles.sideTips}>
          <article>
            <span>🧠</span>
            <strong>Planifica</strong>
            <p>Empieza por una tarea importante.</p>
          </article>
          <article>
            <span>🎯</span>
            <strong>Enfoca</strong>
            <p>Haz menos cosas, pero mejor.</p>
          </article>
        </div>

        <div className={styles.sideRhythm}>
          <span>🚀</span>
          <strong>Ritmo del día</strong>
          <p>
            {resumen.pendientes === 0
              ? "Todo controlado por ahora."
              : `Te queda${resumen.pendientes === 1 ? "" : "n"} ${
                  resumen.pendientes
                } tarea${
                  resumen.pendientes === 1 ? "" : "s"
                } pendiente${resumen.pendientes === 1 ? "" : "s"}.`}
          </p>
          <div>
            <span style={{ width: `${resumen.progreso}%` }} />
          </div>
        </div>

        <button className={styles.logout} onClick={cerrarSesion} type="button">
          Cerrar sesión
        </button>
      </aside>

      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p>Tu día empieza con orden, {user.name}</p>
            <div className={styles.heroProgressWrap}>
              <h1 className={styles.heroLogoText}>
                <span className={styles.heroLogoMark}>N</span>
                <span>NEXO</span>
                <span>TASK</span>
              </h1>
              <div className={styles.heroProgress}>
                <span style={{ width: `${resumen.progreso}%` }} />
              </div>
            </div>
            <strong className={styles.heroProgressText}>
              {resumen.progreso}% completado
            </strong>
          </div>
        </section>

        <section className={styles.board}>
          <section className={styles.mainColumn}>
            {tasksOpen ? (
              <>
                {openPanel === "tareas" && (
                  <section
                    className={`${styles.tasks} ${styles.tasksFull}`}
                    id="ver-tareas"
                  >
                  <div className={styles.taskHeader}>
                    <div>
                      <h2>{labels[filter]}</h2>
                      <p>
                        {viewLabels[activeView]} - {visibles.length} tarea
                        {visibles.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className={styles.headerActions}>
                      <button
                        className={styles.primaryAction}
                        onClick={() => abrirZona("crear-tarea", "crear")}
                        type="button"
                      >
                        + Nueva tarea
                      </button>
                      <button
                        className={styles.backPanel}
                        onClick={abrirPanelPrincipal}
                        type="button"
                      >
                        Resumen
                      </button>
                    </div>
                  </div>

                  <div className={styles.tools}>
                    <div className={styles.filters}>
                      {filtros.map((item) => (
                        <button
                          className={filter === item ? styles.active : ""}
                          key={item}
                          onClick={() => setFilter(item)}
                          type="button"
                        >
                          {labels[item]}
                        </button>
                      ))}
                    </div>
                    <select
                      value={priorityFilter}
                      onChange={(event) => setPriorityFilter(event.target.value)}
                    >
                      <option value="todas">Prioridad</option>
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                    <select
                      value={sortMode}
                      onChange={(event) => setSortMode(event.target.value)}
                    >
                      <option value="fecha">Ordenar por fecha</option>
                      <option value="prioridad">Ordenar por prioridad</option>
                      <option value="recientes">Más recientes</option>
                    </select>
                    <button
                      className={styles.clean}
                      disabled={resumen.completadas === 0 || working === "limpiar"}
                      onClick={borrarCompletadas}
                      type="button"
                    >
                      {working === "limpiar" ? "Limpiando..." : "Limpiar hechas"}
                    </button>
                  </div>

                  <div className={styles.taskList}>
                    {visibles.length === 0 ? (
                      <article className={styles.empty}>
                        {emptyMessage}
                      </article>
                    ) : (
                      visibles.map((task) => (
                        <article
                          className={`${styles.task} ${
                            task.completed ? styles.done : ""
                          } ${isOverdue(task) ? styles.overdue : ""}`}
                          key={task.id}
                        >
                          {editingId === task.id ? (
                            <form
                              className={styles.editForm}
                              onSubmit={guardarEdicion}
                            >
                              <input
                                value={editForm.title}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    title: event.target.value,
                                  })
                                }
                                required
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(event) =>
                                  setEditForm({
                                    ...editForm,
                                    description: event.target.value,
                                  })
                                }
                              />
                              <div className={styles.editGrid}>
                                <select
                                  value={editForm.priority}
                                  onChange={(event) =>
                                    setEditForm({
                                      ...editForm,
                                      priority: event.target.value,
                                    })
                                  }
                                >
                                  <option value="baja">Baja</option>
                                  <option value="media">Media</option>
                                  <option value="alta">Alta</option>
                                </select>
                                <input
                                  type="date"
                                  value={editForm.dueDate}
                                  onChange={(event) =>
                                    setEditForm({
                                      ...editForm,
                                      dueDate: event.target.value,
                                    })
                                  }
                                />
                                <input
                                  type="time"
                                  value={editForm.dueTime}
                                  onChange={(event) =>
                                    setEditForm({
                                      ...editForm,
                                      dueTime: event.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className={styles.editActions}>
                                <button disabled={working === "editar"} type="submit">
                                  {working === "editar" ? "Guardando..." : "Guardar"}
                                </button>
                                <button
                                  disabled={working === "editar"}
                                  onClick={() => setEditingId(null)}
                                  type="button"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className={styles.taskMain}>
                                <button
                                  disabled={working === `estado-${task.id}`}
                                  className={styles.check}
                                  onClick={() => cambiarEstado(task)}
                                  type="button"
                                >
                                  {working === `estado-${task.id}`
                                    ? "..."
                                    : task.completed
                                      ? "OK"
                                      : ""}
                                </button>
                                <div>
                                  <h3>{task.title}</h3>
                                  {task.description && <p>{task.description}</p>}
                                  <div className={styles.meta}>
                                    <span className={styles.metaDate}>
                                      {formatDate(task.dueDate)}
                                    </span>
                                    {task.dueTime && (
                                      <span className={styles.metaTime}>
                                        {task.dueTime}
                                      </span>
                                    )}
                                    {isOverdue(task) && (
                                      <span className={styles.overdueTag}>
                                        Vencida
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className={styles.taskActions}>
                                <span className={styles[task.priority]}>
                                  {task.priority}
                                </span>
                                <button
                                  disabled={Boolean(working)}
                                  onClick={() => empezarEdicion(task)}
                                  type="button"
                                >
                                  Editar
                                </button>
                                <button
                                  disabled={working === `borrar-${task.id}`}
                                  onClick={() => borrarTarea(task.id)}
                                  type="button"
                                >
                                  {working === `borrar-${task.id}`
                                    ? "Borrando..."
                                    : "Borrar"}
                                </button>
                              </div>
                            </>
                          )}
                        </article>
                      ))
                    )}
                  </div>
                  </section>
                )}

                {openPanel === "crear" && (
                  <form
                    className={`${styles.form} ${styles.formFull}`}
                    id="crear-tarea"
                    onSubmit={crearTarea}
                  >
                  <div className={styles.formHead}>
                    <div>
                      <h2>Nueva tarea</h2>
                      <p>Crea una tarea nueva y vuelve a tu panel cuando termines.</p>
                    </div>
                    <div className={styles.quickDates}>
                      <button
                        className={styles.backPanel}
                        onClick={abrirPanelPrincipal}
                        type="button"
                      >
                        Resumen
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      Titulo
                      <input
                        value={form.title}
                        onChange={(event) =>
                          setForm({ ...form, title: event.target.value })
                        }
                        placeholder="Ej: terminar proyecto final"
                        required
                      />
                    </label>

                    <label>
                      Prioridad
                      <select
                        value={form.priority}
                        onChange={(event) =>
                          setForm({ ...form, priority: event.target.value })
                        }
                      >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                      </select>
                    </label>

                    <label>
                      Hora
                      <input
                        type="time"
                        value={form.dueTime}
                        onChange={(event) =>
                          setForm({ ...form, dueTime: event.target.value })
                        }
                      />
                    </label>
                  </div>

                  <section className={styles.calendarBox}>
                    <div className={styles.calendarHead}>
                      <div>
                        <span>Fecha de la tarea</span>
                        <strong>{formatDate(form.dueDate)}</strong>
                      </div>
                      <div className={styles.calendarControls}>
                        <button
                          className={styles.calendarToggle}
                          onClick={() => setCalendarOpen(!calendarOpen)}
                          type="button"
                        >
                          {calendarOpen ? "Cerrar calendario" : "Abrir calendario"}
                        </button>
                      </div>
                    </div>

                    <label className={styles.dateInputLabel}>
                      Cambiar con fecha exacta
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(event) => seleccionarFecha(event.target.value)}
                      />
                    </label>

                    {calendarOpen && (
                      <div className={styles.calendarPanel}>
                        <div className={styles.monthRow}>
                          <button onClick={() => moverMes(-1)} type="button">
                            Anterior
                          </button>
                          <div className={styles.monthTitle}>
                            {getMonthLabel(calendarCursor)}
                          </div>
                          <button onClick={() => moverMes(1)} type="button">
                            Siguiente
                          </button>
                        </div>

                        <div className={styles.weekDays}>
                          {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>

                        <div className={styles.calendarGrid}>
                          {calendarDays.map((day) => (
                            <button
                              className={`${styles.calendarDay} ${
                                !day.currentMonth ? styles.outMonth : ""
                              } ${day.today ? styles.todayDay : ""} ${
                                day.selected ? styles.selectedDay : ""
                              }`}
                              key={day.value}
                              onClick={() => abrirDiaCalendario(day)}
                              type="button"
                            >
                              <span>{day.day}</span>
                              {day.tasks > 0 && (
                                <small className={styles.dayCount}>
                                  {day.tasks} tarea{day.tasks === 1 ? "" : "s"}
                                </small>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {calendarModalDay && modalTasks.length > 0 && (
                    <div className={styles.modalOverlay}>
                      <section className={styles.dayModal}>
                        <div className={styles.dayModalHead}>
                          <div>
                            <span>Tareas programadas</span>
                            <h3>{formatDate(calendarModalDay)}</h3>
                          </div>
                          <button
                            onClick={() => setCalendarModalDay(null)}
                            type="button"
                          >
                            Cerrar
                          </button>
                        </div>

                        <div className={styles.dayModalList}>
                          {modalTasks.map((task) => (
                            <article key={task.id}>
                              <div>
                                <strong>{task.title}</strong>
                                {task.description && <p>{task.description}</p>}
                              </div>
                              <div className={styles.dayModalMeta}>
                                <span>{task.dueTime || "Sin hora"}</span>
                                <span className={styles[task.priority]}>
                                  {task.priority}
                                </span>
                              </div>
                            </article>
                          ))}
                        </div>

                        <button
                          className={styles.save}
                          onClick={() => {
                            setCalendarModalDay(null);
                            setCalendarOpen(false);
                          }}
                          type="button"
                        >
                          Usar esta fecha
                        </button>
                      </section>
                    </div>
                  )}

                  <label>
                    Descripcion
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        setForm({ ...form, description: event.target.value })
                      }
                      placeholder="Notas o detalles de la tarea"
                    />
                  </label>

                  <div className={styles.formActions}>
                    <button
                      className={styles.save}
                      disabled={working === "crear"}
                      type="submit"
                    >
                      {working === "crear" ? "Guardando..." : "Guardar tarea"}
                    </button>
                    <button
                      className={styles.secondary}
                      disabled={working === "crear"}
                      onClick={limpiarFormulario}
                      type="button"
                    >
                      Limpiar
                    </button>
                  </div>
                  {mensaje && <p className={styles.message}>{mensaje}</p>}
                  </form>
                )}
              </>
            ) : (
              <article className={styles.closedBanner}>
                <div className={styles.closedContent}>
                  <span className={styles.closedIcon}>+</span>
                  <div className={styles.closedTitle}>
                    <h3>ORGANIZA TU DÍA</h3>
                    <strong>ORGANIZA TU VIDA</strong>
                  </div>
                  <p>
                    Revisa lo importante, crea una tarea nueva o abre tu bandeja
                    cuando quieras entrar en modo trabajo.
                  </p>

                  <div className={styles.closedActions}>
                    <button
                      onClick={() => abrirZona("ver-tareas", "tareas")}
                      type="button"
                    >
                      Ver tareas
                    </button>
                    <button
                      onClick={() => abrirZona("crear-tarea", "crear")}
                      type="button"
                    >
                      Crear tarea
                    </button>
                  </div>
                </div>

                <div className={styles.closedWidgets} aria-hidden="true">
                  <div className={styles.closedWidget}>
                    <span>OK</span>
                    <strong>{resumen.completadas}</strong>
                    <p>hechas</p>
                  </div>
                  <div className={styles.closedWidget}>
                    <span>T</span>
                    <strong>{resumen.pendientes}</strong>
                    <p>pendientes</p>
                  </div>
                  <div className={styles.closedWidget}>
                    <span>!</span>
                    <strong>{resumen.alta}</strong>
                    <p>urgentes</p>
                  </div>
                  <div className={styles.closedWidget}>
                    <span>F</span>
                    <strong>{resumen.vencidas}</strong>
                    <p>vencidas</p>
                  </div>
                </div>
              </article>
            )}
          </section>

          <aside className={styles.agenda}>
            <section className={styles.focusCard}>
              <span className={styles.focusLabel}>Modo enfoque</span>
              {siguiente ? (
                <>
                  <h2>{siguiente.title}</h2>
                  <p>{siguiente.description || "Sin descripción."}</p>
                  <div className={styles.focusMeta}>
                    <span>{formatDate(siguiente.dueDate)}</span>
                    {siguiente.dueTime && <span>{siguiente.dueTime}</span>}
                  </div>
                  <button
                    disabled={working === `estado-${siguiente.id}`}
                    onClick={() => cambiarEstado(siguiente)}
                    type="button"
                  >
                    {working === `estado-${siguiente.id}`
                      ? "Actualizando..."
                      : "Marcar como hecha"}
                  </button>
                </>
              ) : (
                <>
                  <h2>Todo despejado</h2>
                  <p>No tienes tareas pendientes ahora mismo.</p>
                </>
              )}
            </section>

            <div className={styles.agendaCard}>
              <h2>Agenda</h2>
              <div className={styles.agendaList}>
                {proximas.length === 0 ? (
                  <span>No hay tareas pendientes.</span>
                ) : (
                  proximas.map((task) => (
                    <article key={task.id}>
                      <strong>{task.title}</strong>
                      <span>
                        {formatDate(task.dueDate)}
                        {task.dueTime ? ` - ${task.dueTime}` : ""}
                      </span>
                    </article>
                  ))
                )}
              </div>
            </div>

            <section className={styles.templateCard}>
              <h2>Plantillas rápidas</h2>
              <button onClick={() => usarPlantilla("entrega")} type="button">
                + Entrega
              </button>
              <button onClick={() => usarPlantilla("estudio")} type="button">
                + Estudio
              </button>
              <button onClick={() => usarPlantilla("recordatorio")} type="button">
                + Recordatorio
              </button>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
