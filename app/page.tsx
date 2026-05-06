"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen relative text-white">
      
      {/* Background */}
      <img
        src="/bg.jpg"
        className="absolute w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl md:text-8xl font-bold tracking-wide">
          LKPG ROLEPLAY CITY
        </h1>

        <button
          onClick={() => signIn("discord", { callbackUrl: "/portal" })}
          className="mt-6 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded"
        >
          PORTAL
        </button>
      </div>
    </div>
  );
}