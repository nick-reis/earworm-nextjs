import { requireSession } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || undefined },
    select: { hasTasteProfile: true },
  });

  if (!user) {
    redirect("/");
  }

  if (user.hasTasteProfile) {
    redirect("/app");
  }
  return <>{children}</>;
}
