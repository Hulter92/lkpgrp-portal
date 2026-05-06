"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [apps, setApps] = useState([]);

  const fetchApps = () => {
    fetch("/api/ansokan/all")
      .then(res => res.json())
      .then(data => setApps(data));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/ansokan/update", {
      method: "POST",
      body: JSON.stringify({ id, status }),
    });

    fetchApps();
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Admin Panel
      </h1>

      <div className="space-y-4">

        {apps.map((app) => (
          <div
            key={app.id}
            className="p-4 rounded border border-zinc-300 dark:border-zinc-800"
          >

            <div className="flex justify-between">

              <div>
  <div className="font-semibold">
    {app.fullname}
  </div>

  <div className="text-sm text-zinc-500">
    🎂 {app.birthdate}
  </div>

  <div className="text-sm text-zinc-500">
    {app.characterName} • {app.type}
  </div>
</div>

              <div className="flex gap-2">

  <button
    onClick={() => updateStatus(app.id, "interview")}
    className="px-3 py-1 bg-blue-600 text-white rounded"
  >
    Intervju
  </button>

  <button
    onClick={() => updateStatus(app.id, "approved")}
    className="px-3 py-1 bg-green-600 text-white rounded"
  >
    Godkänn
  </button>

  <button
    onClick={() => updateStatus(app.id, "denied")}
    className="px-3 py-1 bg-red-600 text-white rounded"
  >
    Neka
  </button>

</div>

            </div>

            <div
              className="mt-4 text-sm"
              dangerouslySetInnerHTML={{ __html: app.story }}
            />

            <div className="mt-2 text-xs text-zinc-500">
              Status: {app.status}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}