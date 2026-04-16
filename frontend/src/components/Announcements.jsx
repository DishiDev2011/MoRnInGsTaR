import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Announcements() {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const r = await api.announcements.list();
        setList(r.data.announcements);
      } catch (e) {
        console.error(e);
      }
    }
    load();

    // SSE
    const es = new EventSource(
      (import.meta.env.VITE_API_BASE || "http://localhost:4000") +
        "/api/announcements/stream",
      { withCredentials: false },
    );
    es.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        setList((prev) => [data.announcement, ...prev]);
      } catch (e) {}
    };
    return () => es.close();
  }, []);

  async function create() {
    try {
      await api.announcements.create({ title, body });
      setTitle("");
      setBody("");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className="panel">
      <h3>Announcements</h3>
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button onClick={create}>Create (admins only)</button>
      </div>
      <ul>
        {list.map((a) => (
          <li key={a.id} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
            <strong>{a.title}</strong>
            <div>{a.body}</div>
            <small>{new Date(a.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
