import { requireUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();

  if (user.hasTasteProfile) {
    redirect("/app");
  }
  return <>{children}</>;
}
