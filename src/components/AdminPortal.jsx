import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function AdminLayout() {
  const { isStylist, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="le-loading">Loading…</div>;
  if (!isStylist) {
    return (
      <main style={{ padding: 80, textAlign: "center" }}>
        <p>Stylist access required.</p>
        <button className="le-link" onClick={() => navigate("/")}>Home</button>
      </main>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, padding: "40px 28px", maxWidth: 1200, margin: "0 auto" }}>
      <aside>
        <p className="le-eyebrow" style={{ color: C.gold }}>Admin</p>
        <nav style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <Link to="/admin">Review queue</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/consults">Consults</Link>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
}

export function AdminReviewQueue() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    fetch("/api/catalog/capsules/pending/review").then((r) => r.json()).then((d) => setCapsules(d.capsules || []));
  }, []);

  const approve = async (id, email) => {
    await fetch(`/api/catalog/capsules/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "client_review" }),
    });
    if (email) {
      await fetch("/api/email/capsule-approved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, capsuleId: id }),
      });
    }
    setCapsules((c) => c.filter((x) => x.id !== id));
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 32 }}>Review queue</h1>
      {!capsules.length ? <p>No capsules pending review.</p> : capsules.map((c) => (
        <div key={c.id} style={{ border: `1px solid ${C.line}`, padding: 20, marginTop: 16 }}>
          <p>{c.profiles?.email} — {c.season} — {c.status}</p>
          <button className="le-btn" style={{ marginTop: 12 }} onClick={() => approve(c.id, c.profiles?.email)}>Send to client</button>
        </div>
      ))}
    </div>
  );
}

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", brand: "", category: "", price_cents: 0, image_url: "" });

  const load = () => fetch("/api/catalog/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await fetch("/api/catalog/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name: "", brand: "", category: "", price_cents: 0, image_url: "" });
    load();
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 32, marginBottom: 24 }}>Products ({products.length})</h1>
      <form onSubmit={add} style={{ marginBottom: 32, display: "grid", gap: 8, maxWidth: 400 }}>
        <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Brand" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <input placeholder="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Price cents" type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })} />
        <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <button type="submit" className="le-btn">Add product</button>
      </form>
    </div>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x));
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 32 }}>Orders</h1>
      {orders.map((o) => (
        <div key={o.id} style={{ padding: 16, borderTop: `1px solid ${C.line}` }}>
          <span>{o.id.slice(0, 8)} — {o.status}</span>
          {["packed", "shipped", "delivered"].map((s) => (
            <button key={s} className="le-btn le-btn--ghost" style={{ marginLeft: 8, padding: "6px 12px" }} onClick={() => updateStatus(o.id, s)}>{s}</button>
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminConsults() {
  const [consults, setConsults] = useState([]);

  useEffect(() => {
    import("../lib/supabase.js").then(({ supabase, isSupabaseConfigured }) => {
      if (isSupabaseConfigured()) {
        supabase.from("consults").select("*").order("created_at", { ascending: false }).limit(50)
          .then(({ data }) => setConsults(data || []));
      }
    });
  }, []);

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 32 }}>Consults</h1>
      {consults.map((c) => (
        <div key={c.id} style={{ padding: 12, borderTop: `1px solid ${C.line}` }}>
          {c.name} — {c.email} — {c.type} — {c.status}
        </div>
      ))}
    </div>
  );
}
