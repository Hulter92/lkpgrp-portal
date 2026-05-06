"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, LogOut, Home, BookOpen, ClipboardList, ChevronDown } from "lucide-react";

export default function PortalLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState("spelare");
  const [role, setRole] = useState("Laddar...");
  const [showSettings, setShowSettings] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Sync theme
  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.style.setProperty("--background", "#0a0a0a");
    document.documentElement.style.setProperty("--foreground", "#ededed");
    setIsDark(true);
  } else {
    document.documentElement.style.setProperty("--background", "#ffffff");
    document.documentElement.style.setProperty("--foreground", "#171717");
    setIsDark(false);
  }
}, []);

  // Toggle theme
  const toggleDarkMode = () => {
  const newDark = !isDark;

  if (newDark) {
    document.documentElement.style.setProperty("--background", "#0a0a0a");
    document.documentElement.style.setProperty("--foreground", "#ededed");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.style.setProperty("--background", "#ffffff");
    document.documentElement.style.setProperty("--foreground", "#171717");
    localStorage.setItem("theme", "light");
  }

  setIsDark(newDark);
};

  const toggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Skydda portal
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);


  // Discord roll
  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/discord/role?userId=${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        const roles = data.roles || [];

        if (roles.includes("1501163659760500868")) {
          setRole("Headquarters");
        } else if (roles.includes("1501165906347425872")) {
          setRole("Whitelisted");
        } else {
          setRole("Ansökande");
        }
      })
      .catch(() => setRole("Spelare"));
  }, [session]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        Laddar...
      </div>
    );
  }

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <aside
        className="w-72 p-4 flex flex-col justify-between relative border-r transition-colors"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          borderColor: isDark ? "#27272a" : "#e4e4e7",
        }}
      >
        <div>
          <h1 className="text-xl font-bold mb-6 text-center">
            LKPGRP Portal
          </h1>

          <nav className="space-y-2">

            {/* Spelare */}
            <div>
              <button
                onClick={() => toggle("spelare")}
                className="w-full flex items-center justify-between p-2 text-zinc-500 hover:text-[var(--foreground)]"
              >
                <span>Spelare</span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openMenu === "spelare" ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              {openMenu === "spelare" && (
                <div className="ml-4 mt-2 space-y-1">
                  <Link
                    href="/portal"
                    className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800/40"
                  >
                    <Home size={18} />
                    <span>Hem</span>
                  </Link>

                  <Link
                    href="/portal/regler"
                    className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800/40"
                  >
                    <BookOpen size={18} />
                    <span>Regler</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Ansökande */}
            <div>
              <button
                onClick={() => toggle("ansokan")}
                className="w-full flex items-center justify-between p-2 text-zinc-500 hover:text-[var(--foreground)]"
              >
                <span>Ansökande</span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openMenu === "ansokan" ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              {openMenu === "ansokan" && (
                <div className="ml-4 mt-2 space-y-1">
                  <Link
                    href="/portal/ansokan"
                    className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800/40"
                  >
                    <ClipboardList size={18} />
                    <span>Ansökan</span>
                  </Link>
                  <Link
                    href="/portal/min-ansokan"
                    className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800/40"
                  >
                    <ClipboardList size={18} />
                    <span>Min ansökan</span>
                  </Link>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* User */}
        <div
          className="border-t pt-4 flex items-center justify-between"
          style={{
            borderColor: isDark ? "#27272a" : "#e4e4e7",
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={session?.user?.image}
              className="w-12 h-12 rounded-full border"
              style={{
                borderColor: isDark ? "#3f3f46" : "#d4d4d8",
              }}
            />

            <div className="min-w-0">
              <div className="text-base font-semibold truncate">
                {session?.user?.name}
              </div>

              <div className="text-xs text-zinc-500 uppercase mt-1">
                {role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 border rounded-md transition hover:bg-zinc-800/40"
              style={{
                borderColor: isDark ? "#3f3f46" : "#d4d4d8",
              }}
            >
              <Settings size={18} />
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 border rounded-md transition hover:bg-zinc-800/40"
              style={{
                borderColor: isDark ? "#3f3f46" : "#d4d4d8",
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div
            className="absolute bottom-24 left-4 w-64 rounded-lg p-4 shadow-lg backdrop-blur"
            style={{
              background: "var(--background)",
              color: "var(--foreground)",
              border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
            }}
          >
            <h2 className="text-sm font-semibold mb-4">
              Inställningar
            </h2>

            <div className="flex items-center justify-between">
              <span className="text-sm">Mörkt tema</span>

              <button
                onClick={toggleDarkMode}
                className={`w-10 h-5 flex items-center rounded-full transition ${
                  isDark ? "bg-blue-500" : "bg-zinc-600"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transform transition ${
                    isDark ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}