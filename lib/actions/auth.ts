"use server";

import { auth, signIn, signOut } from "@/app/auth";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await auth();
  if (!session) redirect("/");
  return session;
}

export const login = async () => {
  await signIn("spotify", { redirectTo: "/app" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
