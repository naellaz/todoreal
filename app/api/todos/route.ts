import { pool } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM todo_real ORDER BY id DESC");
    return Response.json(rows);
  } catch (err: any) {
    console.error("GET /api/todos error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title } = await req.json();
  await pool.query("INSERT INTO todo_real (title, done) VALUES ($1, false)", [title]);
  return Response.json({ ok: true });
}

export async function PUT(req: Request) {
  const { id, title, done } = await req.json();
  if (title !== undefined) {
    await pool.query("UPDATE todo_real SET title = $1 WHERE id = $2", [title, id]);
  } else if (done !== undefined) {
    await pool.query("UPDATE todo_real SET done = $1 WHERE id = $2", [done, id]);
  }
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await pool.query("DELETE FROM todo_real WHERE id = $1", [id]);
  return Response.json({ ok: true });
}
