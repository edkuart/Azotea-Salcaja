import "server-only";

import { NextResponse } from "next/server";
import { getSession } from "./session";

export async function requireApiSession() {
  const session = await getSession();
  if (!session?.userId) {
    return {
      session: null,
      response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }
  return { session, response: null };
}
