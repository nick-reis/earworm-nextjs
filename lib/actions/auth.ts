"use server";

import { auth, signIn, signOut } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");
  return session;
}

export async function requireUser() {
  const session = await requireSession();

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || undefined },
  });

  if (!user) redirect("/");
  return { session, user };
}

export async function requireTasteProfile() {
  const { session, user } = await requireUser();

  if (!user.hasTasteProfile) redirect("/onboarding");
  return { session, user };
}

export const login = async () => {
  await signIn("spotify", { redirectTo: "/app" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
