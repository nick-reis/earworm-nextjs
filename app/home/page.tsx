"use server";
import { Button } from "@/components/ui/button";
import { logout, requireSession } from "@/lib/actions/auth";

export default async function Home() {
  const session = await requireSession();

  return (
    <div className=" min-h-screen font-sans bg-background">
      <main className="w-full h-screen flex flex-col gap-4 justify-center items-center ">
        <h1 className="text-xl font-medium">Hey {session.user?.name}!</h1>
        <p className="text-primary font-mono -mt-3">{session.user?.email}</p>
        <Button variant={"outline"} onClick={logout}>
          Sign out
        </Button>
      </main>
    </div>
  );
}
