export const localQuotes = [
  {
    quote: "Una tarea pequeña terminada pesa menos que una grande pendiente.",
    author: "NexoTask",
  },
  {
    quote: "Ordenar el día también cuenta como avanzar.",
    author: "NexoTask",
  },
  {
    quote: "Primero lo importante, después lo urgente.",
    author: "NexoTask",
  },
  {
    quote: "Si lo apuntas, deja de ocupar sitio en la cabeza.",
    author: "NexoTask",
  },
];

export const fallbackQuote = {
  quote: "Paso a paso también se termina una práctica grande.",
  author: "NexoTask",
};

export function pickLocalQuote(seed) {
  const index = Math.abs(seed % localQuotes.length);
  return localQuotes[index];
}

export async function getMotivationQuote() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar la frase");
    }

    const data = await response.json();
    return pickLocalQuote(data.id || data.quote.length);
  } catch (error) {
    return fallbackQuote;
  }
}
