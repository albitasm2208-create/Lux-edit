import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function AccountReturns() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`/api/orders?userId=${user?.id}`).then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, [user?.id]);

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/fulfillment/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, orderId, notes }),
    });
    setSent(true);
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, margin: "0 0 24px" }}>Return pickup</h1>
      {sent ? <p>Return request submitted.</p> : (
        <form onSubmit={submit} style={{ maxWidth: 400 }}>
          <select required value={orderId} onChange={(e) => setOrderId(e.target.value)} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }}>
            <option value="">Select order</option>
            {orders.map((o) => <option key={o.id} value={o.id}>{o.id.slice(0, 8)} — {o.status}</option>)}
          </select>
          <textarea placeholder="Reason for return" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <button type="submit" className="le-btn">Request pickup</button>
        </form>
      )}
    </div>
  );
}
