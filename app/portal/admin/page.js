"use client";

import { useEffect, useState } from "react";

const statusColor = {
  pending: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/20 text-green-400",
  denied: "bg-red-500/20 text-red-400",
  interview_booked: "bg-blue-500/20 text-blue-400",
  interview_done: "bg-purple-500/20 text-purple-400",
};

const statusConfig = {
  pending: { label: "⏳ Väntar" },
  interview_booked: { label: "🎤 Intervju bokad" },
  interview_done: { label: "🟣 Intervju klar" },
  approved: { label: "✅ Godkänd" },
  denied: { label: "❌ Nekad" },
};

export default function AdminPanel() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);

  const [modalRole, setModalRole] = useState("whitelist");
  const [lastCount, setLastCount] = useState(0);

  const pageSize = 5;

  const fetchApps = () => {
    fetch("/api/ansokan/all")
      .then((res) => res.json())
      .then((data) => {

        // 🔔 notification
        if (data.length > lastCount && lastCount !== 0) {
          alert("🚨 Ny ansökan!");
        }

        setLastCount(data.length);
        setApps(data);
      });
  };

  // 🔄 live update
  useEffect(() => {
    fetchApps();
    const interval = setInterval(fetchApps, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔎 filter + search
  const filtered = apps
    .filter((app) =>
      app.fullname.toLowerCase().includes(search.toLowerCase())
    )
    .filter((app) => (filter === "all" ? true : app.status === filter));

  // 📄 pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // 📊 stats
  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    interview_booked: apps.filter(a => a.status === "interview_booked").length,
    interview_done: apps.filter(a => a.status === "interview_done").length,
    approved: apps.filter(a => a.status === "approved").length,
    denied: apps.filter(a => a.status === "denied").length,
  };

  const updateStatus = async (id, status, roleType = null) => {
    await fetch("/api/ansokan/update", {
      method: "POST",
      body: JSON.stringify({ id, status, roleType }),
    });
    fetchApps();
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-5 gap-4 mb-8">

        <div className="p-4 rounded bg-zinc-900 text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-zinc-400">Totalt</div>
        </div>

        <div className="p-4 rounded bg-yellow-500/20 text-center">
          <div className="text-xl font-bold">{stats.pending}</div>
          <div className="text-xs">Pending</div>
        </div>

        <div className="p-4 rounded bg-blue-500/20 text-center">
          <div className="text-xl font-bold">{stats.interview_booked}</div>
          <div className="text-xs">Intervju bokad</div>
        </div>

        <div className="p-4 rounded bg-purple-500/20 text-center">
          <div className="text-xl font-bold">{stats.interview_done}</div>
          <div className="text-xs">Intervju klar</div>
        </div>

        <div className="p-4 rounded bg-green-500/20 text-center">
          <div className="text-xl font-bold">{stats.approved}</div>
          <div className="text-xs">Godkända</div>
        </div>

        <div className="p-4 rounded bg-red-500/20 text-center">
          <div className="text-xl font-bold">{stats.denied}</div>
          <div className="text-xs">Nekade</div>
        </div>

      </div>

      {/* 🔎 SEARCH + FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Sök namn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-zinc-800 text-white w-full"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded bg-zinc-800 text-white"
        >
          <option value="all">Alla</option>
          <option value="pending">Pending</option>
          <option value="interview_booked">Intervju bokad</option>
          <option value="interview_done">Intervju klar</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {/* 📋 LIST */}
      <div className="space-y-4">
        {paginated.map((app) => (
          <div
            key={app.id}
            onClick={() => {
              setSelectedApp(app);
              setModalRole("whitelist");
            }}
            className="p-4 rounded border border-zinc-300 dark:border-zinc-800 cursor-pointer hover:bg-zinc-800/30 transition"
          >
            <div className="flex justify-between">

              <div>
                <div className="font-semibold">{app.fullname}</div>
                <div className="text-sm text-zinc-500">
                  {app.characterName}
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit backdrop-blur border border-white/10 hover:scale-105 transition ${statusColor[app.status]}`}>
  {statusConfig[app.status]?.label || app.status}
</span>

            </div>
          </div>
        ))}
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-zinc-700 text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 🪟 MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4">
  {selectedApp.fullname}
</h2>

<div className="mb-3">
  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit backdrop-blur border border-white/10 hover:scale-105 transition ${statusColor[selectedApp.status]}`}>
    {statusConfig[selectedApp.status]?.label}
  </span>
</div>

            <div className="text-sm text-zinc-400 mb-2">
              🎂 {selectedApp.birthdate}
            </div>

            <div className="text-sm text-zinc-400 mb-4">
              {selectedApp.characterName} • {selectedApp.type}
            </div>

            <div
              className="prose prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: selectedApp.story }}
            />

            {/* 🎭 ROLE SELECT */}
            <div className="mt-6">
              <span className="text-sm text-zinc-400">Discord roll</span>

              <select
                value={modalRole}
                onChange={(e) => setModalRole(e.target.value)}
                className="mt-2 w-full p-2 rounded bg-zinc-800 text-white"
              >
                <option value="whitelist">Whitelist</option>
                <option value="staff">Staff</option>
                <option value="police">Police</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-6">

              <button
                onClick={() => updateStatus(selectedApp.id, "interview_booked")}
                className="bg-blue-600 px-3 py-1 rounded"
              >
                Intervju
              </button>

              <button
                onClick={() => updateStatus(selectedApp.id, "interview_done")}
                className="bg-purple-600 px-3 py-1 rounded"
              >
                Intervju klar
              </button>

              <button
                onClick={() =>
                  updateStatus(selectedApp.id, "approved", modalRole)
                }
                className="bg-green-600 px-3 py-1 rounded"
              >
                Godkänn
              </button>

              <button
                onClick={() => updateStatus(selectedApp.id, "denied")}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Neka
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="ml-auto text-zinc-400"
              >
                Stäng
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}