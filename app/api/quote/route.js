import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar la frase");
    }

    const data = await response.json();

    return NextResponse.json({
      quote: data.quote,
      author: data.author,
    });
  } catch (error) {
    return NextResponse.json({
      quote: "Paso a paso tambien se termina una practica grande.",
      author: "NexoTask",
    });
  }
}
