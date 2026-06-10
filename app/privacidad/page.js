import Link from "next/link";
import styles from "../legal.module.css";

const sections = [
  "Responsable",
  "Datos tratados",
  "Finalidad",
  "Base de legitimacion",
  "Conservacion",
  "Seguridad",
  "Derechos",
  "Contacto",
];

export default function PrivacidadPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Link href="/registro" className={styles.back}>
          Volver al registro
        </Link>
        <p>NexoTask</p>
        <h1>Politica de privacidad</h1>
        <span>Ultima actualizacion: junio de 2026</span>
      </section>

      <section className={styles.layout}>
        <aside className={styles.index}>
          <strong>Contenido</strong>
          {sections.map((section) => (
            <a href={`#${section.toLowerCase().replaceAll(" ", "-")}`} key={section}>
              {section}
            </a>
          ))}
        </aside>

        <div className={styles.panel}>
          <article id="responsable">
            <h2>1. Responsable del proyecto</h2>
            <p>
              El responsable de este proyecto academico es Juan Francisco
              Jimenez Bautista, alumno de 2 DAW. NexoTask se ha desarrollado
              como proyecto final de clase y su uso esta pensado para una demo
              educativa.
            </p>
          </article>

          <article id="datos-tratados">
            <h2>2. Datos tratados</h2>
            <p>
              La aplicacion puede guardar nombre, correo electronico, datos de
              sesion y las tareas creadas por el usuario. Las contrasenas no se
              guardan en texto plano, ya que la autenticacion se gestiona con
              better-auth. No se solicitan datos bancarios, direcciones postales
              ni informacion sensible que no sea necesaria para usar el gestor.
            </p>
          </article>

          <article id="finalidad">
            <h2>3. Finalidad del uso de datos</h2>
            <p>
              Los datos se usan para permitir el registro, inicio de sesion,
              acceso al dashboard y gestion de tareas personales dentro de la
              aplicacion.
            </p>
          </article>

          <article id="base-de-legitimacion">
            <h2>4. Base de legitimacion</h2>
            <p>
              El tratamiento se basa en el consentimiento del usuario al crear
              la cuenta y aceptar esta politica de privacidad.
            </p>
          </article>

          <article id="conservacion">
            <h2>5. Conservacion de datos</h2>
            <p>
              Los datos se mantienen mientras exista la cuenta o mientras sean
              necesarios para el funcionamiento de la demo academica. En un
              despliegue de prueba, la base de datos puede reiniciarse o
              eliminarse al actualizar el proyecto.
            </p>
          </article>

          <article id="seguridad">
            <h2>6. Medidas de seguridad</h2>
            <p>
              El proyecto usa variables de entorno, sesiones gestionadas por
              better-auth y consultas filtradas por usuario para evitar que una
              cuenta pueda acceder a tareas de otra. Ademas, el repositorio no
              debe incluir archivos `.env.local` ni claves reales.
            </p>
          </article>

          <article id="derechos">
            <h2>7. Derechos del usuario</h2>
            <p>
              En un entorno real, el usuario podria solicitar acceso,
              rectificacion o eliminacion de sus datos. En este proyecto, al
              ser academico, estos derechos se simulan a nivel funcional.
            </p>
          </article>

          <article id="contacto">
            <h2>8. Contacto</h2>
            <p>
              Para cualquier duda relacionada con este proyecto se puede usar el
              repositorio de GitHub o el contacto indicado en la entrega.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
