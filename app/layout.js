import "./globals.css";

export const metadata = {
  title: "NexoTask",
  description: "Gestor de tareas para el proyecto final",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
