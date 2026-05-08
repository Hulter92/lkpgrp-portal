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

        {/* 🎮 DISCORD BOX */}
  <div className="mt-8 p-6 rounded-2xl bg-zinc-900/80 backdrop-blur border border-zinc-800 max-w-md">

    <h2 className="text-lg font-semibold mb-2">
      🎮 Nästa steg
    </h2>

    <p className="text-sm text-zinc-400 mb-4">
      Du måste gå med i Discord-servern innan du kan bli godkänd.
    </p>

    <a
      href={process.env.NEXT_PUBLIC_DISCORD_INVITE}
      target="_blank"
      className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-semibold inline-block transition"
    >
      🚀 Gå med i Discord
    </a>

      </div>

      </div>

    </div>

  );
}