import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function AdminPanel() {
  const [issues, setIssues] = useState([]);

  async function load() {
    const r = await api.issues.list();
    setIssues(r.data.issues);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="panel">
      <h3>Admin Panel</h3>
      <div>
        <h4>Issues</h4>
        <ul>
          {issues.map((i) => (
            <li
              key={i.id}
              style={{ border: "1px solid #ddd", padding: 8, marginBottom: 6 }}
            >
              <strong>{i.title}</strong> <em>({i.status})</em>
              <div>{i.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
