"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Ansokan() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    fullname: "",
    birthdate: "",
    characterName: "",
    type: "laglig",
    story: `<p>• Din karaktärs namn och ålder:</p>
<p>• Beskriv din karaktärs egenskaper och personlighet:</p>
<p>• På vilket sätt bidrar din karaktär till RP:</p>
<p>• Hur hanterar du konflikter IC:</p>
<p>• Vad innebär mogen RP för dig:</p>`,
    accepted: false,
  });

  const maxChars = 3000;

  // 🧠 TipTap editor
  const editor = useEditor({
  extensions: [StarterKit],
  content: form.story,

  immediatelyRender: false, // 🔥 FIXEN

  onUpdate: ({ editor }) => {
    setForm((prev) => ({
      ...prev,
      story: editor.getHTML(),
    }));
  },
});

  const charCount = form.story.replace(/<[^>]*>/g, "").length;

  const submit = async () => {
    if (!form.accepted) {
      alert("Du måste godkänna villkoren");
      return;
    }

    if (!session) return;

    await fetch("/api/ansokan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        username: session.user.name,
        ...form,
      }),
    });

    alert("Ansökan skickad!");
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Ansökan
      </h1>

      {/* Personlig info */}
      <div className="space-y-2">
        <h2 className="font-semibold">Personlig information</h2>

        <input
          placeholder="Fullständigt namn"
          className="w-full p-3 rounded border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400
focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
        />

        <input
          placeholder="Födelsedatum (YYYY/MM/DD)"
          className="w-full p-3 rounded border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400
focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
        />
      </div>

      {/* Karaktär */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Karaktär information</h2>

        <input
          placeholder="Karaktärsnamn"
          className="w-full p-3 rounded 
border border-zinc-300 dark:border-zinc-800 
bg-zinc-100 dark:bg-zinc-900 
text-black dark:text-white 
placeholder:text-zinc-500 dark:placeholder:text-zinc-400
focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, characterName: e.target.value })
          }
        />
      </div>

      {/* Karaktärstyp */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Karaktärstyp</h2>

        <div className="flex gap-6">
          {[
            { label: "Laglig", value: "laglig" },
            { label: "Kriminell", value: "kriminell" },
            { label: "Sjukvård/Polis", value: "sjukvard" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 cursor-pointer">
              
              <div
                className={`w-4 h-4 rounded-full border ${
                  form.type === item.value
                    ? "bg-black dark:bg-white border-black dark:border-white"
                    : "border-zinc-400"
                }`}
              />

              <input
                type="radio"
                className="hidden"
                checked={form.type === item.value}
                onChange={() => setForm({ ...form, type: item.value })}
              />

              {item.label}
            </label>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="mt-6">

        {/* Toolbar */}
        <div className="flex gap-2 p-2 border border-zinc-300 dark:border-zinc-800 rounded-t">

          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="px-2 font-bold"
          >
            B
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="px-2 italic"
          >
            I
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="px-2"
          >
            •
          </button>

        </div>

        {/* Editor content */}
        <EditorContent
          editor={editor}
          className="p-3 border border-t-0 border-zinc-300 dark:border-zinc-800 rounded-b min-h-[250px]"
        />

        {/* Char counter */}
        <div className="text-right text-xs text-zinc-500 mt-1">
          {charCount}/{maxChars}
        </div>

      </div>

      {/* Checkbox */}
      <div className="mt-6 flex items-center gap-2">
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({ ...form, accepted: e.target.checked })
          }
        />
        <span className="text-sm">
          Jag godkänner villkoren
        </span>
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        className="w-full mt-4 py-3 rounded bg-black text-white font-semibold hover:opacity-80"
      >
        SKICKA ANSÖKAN
      </button>

    </div>
  );
}