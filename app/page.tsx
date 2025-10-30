"use server";
import { Button } from "@/components/ui/button";
import { login, logout } from "@/lib/actions/auth";
import { auth } from "./auth";

export default async function Home() {
  const session = await auth();
  console.log(session);

  if (session?.user) {
    return (
      <div className=" min-h-screen font-sans bg-background">
        <main className="w-full h-screen flex flex-col gap-4 justify-center items-center ">
          <h1 className="text-xl font-medium ">Hey {session.user.name}!</h1>
          <Button variant={"outline"} onClick={logout}>
            Sign out
          </Button>
        </main>
      </div>
    );
  }
  return (
    <div className=" min-h-screen font-sans bg-background">
      <main className="w-full h-screen flex justify-center items-center ">
        <Button onClick={login}>Sign in</Button>
      </main>
    </div>
  );
}
