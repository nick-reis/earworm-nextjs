import { requireTasteProfile } from "@/lib/actions/auth";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await requireTasteProfile();

  return <>{children}</>;
}
