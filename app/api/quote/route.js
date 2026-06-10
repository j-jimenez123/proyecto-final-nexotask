import { NextResponse } from "next/server";
import { getMotivationQuote } from "../../../lib/quotes";

export async function GET() {
  const quote = await getMotivationQuote();

  return NextResponse.json(quote);
}
