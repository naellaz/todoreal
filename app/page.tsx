"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

 async function refresh() {
  const res = await fetch("/api/todos");
  if (!res.ok) {
    console.error("API error:", res.status);
    setTodos([]);
    return;
  }
  const data = await res.json();
  console.log("API DATA:", data); // cek bentuknya
  setTodos(data);
}


  useEffect(() => { refresh(); }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    setTitle("");
    refresh();
  }

  async function toggle(id: string, done: boolean) {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id, done: !done }),
    });
    refresh();
  }

  async function remove(id: string) {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  async function saveEdit(id: string) {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id, title: editTitle }),
    });
    setEditingId(null);
    setEditTitle("");
    refresh();
  }

  return (
    <main className="container">
      <h1 className="title">✨ Todo App Elegan ✨</h1>
      <form onSubmit={addTodo} className="form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah todo..."
          required
        />
        <button type="submit">Tambah</button>
      </form>
      <ul className="list">
        {todos.map((t) => (
          <li key={t.id} className="list-item">
            {editingId === t.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="edit-input"
                />
                <button className="save" onClick={() => saveEdit(t.id)}>
                  Simpan
                </button>
                <button className="cancel" onClick={() => setEditingId(null)}>
                  Batal
                </button>
              </>
            ) : (
              <>
                <label>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggle(t.id, t.done)}
                  />
                  <span className={t.done ? "done" : ""}>{t.title}</span>
                </label>
                <div className="actions">
                  <button
                    className="edit"
                    onClick={() => {
                      setEditingId(t.id);
                      setEditTitle(t.title);
                    }}
                  >
                    ✏️
                  </button>
                  <button className="delete" onClick={() => remove(t.id)}>
                    ❌
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
