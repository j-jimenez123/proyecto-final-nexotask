export const localQuotes = [
  {
    quote: "Una tarea pequena terminada pesa menos que una grande pendiente.",
    author: "NexoTask",
  },
  {
    quote: "Ordenar el dia tambien cuenta como avanzar.",
    author: "NexoTask",
  },
  {
    quote: "Primero lo importante, despues lo urgente.",
    author: "NexoTask",
  },
  {
    quote: "Si lo apuntas, deja de ocupar sitio en la cabeza.",
    author: "NexoTask",
  },
];

export const fallbackQuote = {
  quote: "Paso a paso tambien se termina una practica grande.",
  author: "NexoTask",
};

export function pickLocalQuote(seed) {
  const index = Math.abs(seed % localQuotes.length);
  return localQuotes[index];
}
