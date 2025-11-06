"use server";
import { Button } from "@/components/ui/button";
import { logout, requireUser } from "@/lib/actions/auth";
import { Github, Settings } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const { user } = await requireUser();

  return (
    <div className=" min-h-screen font-sans bg-background">
      <main className="w-full flex flex-col h-screen">
        <div className="border-b flex justify-between items-center p-6">
          <div className="flex cursor-pointer select-none items-center gap-2">
            <Image src="/icon.svg" width={60} height={60} alt="Earworm Logo" />
            <h1 className=" font-fredoka font-medium text-3xl">earworm</h1>
          </div>
          <div className="flex items-center gap-2">
            {user?.image ? (
              <Image
                src={user?.image || ""}
                alt={user?.name || "Avatar"}
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <div className="w-[50px] mx-4 h-[50px] flex items-center select-none cursor-pointer text-xl justify-center font-medium rounded-full bg-blue-500">
                {user?.name && Array.from(user.name)[0]}
              </div>
            )}

            <div className="hover:bg-accent rounded-md p-4">
              <Github />
            </div>
            <div className="hover:bg-accent rounded-md p-4">
              <Settings />
            </div>
          </div>
        </div>

        <div className="h-full flex flex-col gap-4 justify-center items-center">
          <h1 className="text-xl font-medium">Hey {user?.name}!</h1>
          <p className="text-primary font-mono -mt-3">{user?.email}</p>
          <Button variant={"outline"} onClick={logout}>
            Sign out
          </Button>
        </div>
      </main>
    </div>
  );
}
