import { NextResponse } from "next/server";
import { fallbackQuote, pickLocalQuote } from "../../../lib/quotes";

export async function GET() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar la frase");
    }

    const data = await response.json();

    return NextResponse.json(pickLocalQuote(data.id || data.quote.length));
  } catch (error) {
    return NextResponse.json(fallbackQuote);
  }
}
