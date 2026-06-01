"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/auth/session";

const LoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export type LoginState = { error?: string } | undefined;

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const { email, password } = result.data;
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  const emailOk =
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  const passwordOk = password === adminPassword;

  if (!emailOk || !passwordOk) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await createSession("admin", "owner");
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
