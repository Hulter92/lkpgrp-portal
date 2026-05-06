"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MinAnsokan() {
  const { data: session } = useSession();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/ansokan/user?userId=${session.user.id}`)
      .then(res => res.json())
      .then(data => setApplication(data));
  }, [session]);

  if (!application) {
    return (
      <div className="p-10 text-center text-zinc-500">
        Ingen ansökan hittad
      </div>
    );
  }

  // 🎨 Status färger
  const statusStyles = {
    pending: "text-yellow-500",
    interview: "text-blue-500",
    approved: "text-green-500",
    denied: "text-red-500",
  };

  // 📅 format datum
  const formatDate = (d) =>
    `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Min ansökan
      </h1>

      <div className="border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 backdrop-blur">

        <div className="space-y-5 text-sm">

          {/* Namn */}
          <div>
            <span className="text-zinc-500">Fullständigt namn</span>
            <div className="font-semibold text-base">
              {application.fullname}
            </div>
          </div>

          {/* Födelsedatum */}
          <div>
            <span className="text-zinc-500">Födelsedatum</span>
            <div className="font-semibold text-base">
              🎂 {formatDate(application.birthdate)}
            </div>
          </div>

          {/* Karaktär */}
          <div>
            <span className="text-zinc-500">Karaktärsnamn</span>
            <div className="font-semibold text-base">
              {application.characterName}
            </div>
          </div>

          {/* Typ */}
          <div>
            <span className="text-zinc-500">Karaktärstyp</span>
            <div className="font-semibold text-base capitalize">
              {application.type}
            </div>
          </div>

          {/* Story */}
          <div>
            <span className="text-zinc-500">Ansökan</span>

            <div
            className="mt-2 p-4 rounded 
            bg-zinc-100 dark:bg-zinc-900 
            border border-zinc-300 dark:border-zinc-800 
            text-sm leading-relaxed
            text-black dark:text-zinc-200"
            dangerouslySetInnerHTML={{ __html: application.story }}
            />
         </div>

        </div>

        {/* Status */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">

          <span className="text-zinc-500 text-sm">
            Status
          </span>

          <div className={`text-lg font-bold mt-1 ${statusStyles[application.status]}`}>
            {application.status.toUpperCase()}
          </div>

        </div>

      </div>

    </div>
  );
}