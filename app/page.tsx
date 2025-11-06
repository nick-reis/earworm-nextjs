"use server";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/actions/auth";

export default async function LandingPage() {
  return (
    <div className=" min-h-screen font-sans bg-background">
      <main className="w-full h-screen flex justify-center items-center ">
        <Button onClick={login}>Sign in</Button>
      </main>
    </div>
  );
}
