"use client";

import { useSession } from "next-auth/react";

export default function PortalHome() {
  const { data: session } = useSession();

  return (
    <div className="h-full relative text-white">

      {/* Background */}
      <img
        src="/bg.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-wide drop-shadow-lg">
          LKPG ROLEPLAY CITY
        </h1>

        <p className="mt-4 text-lg md:text-xl text-zinc-300">
          Välkommen {session?.user?.name}
        </p>

      </div>
    </div>
  );
}