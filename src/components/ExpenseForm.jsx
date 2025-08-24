import { useEffect, useState } from "react";
import { CATEGORIES } from "../utils/categories";

export default function ExpenseForm({ onSubmit, editing, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "food",
    date: new Date().toISOString().slice(0, 10),
    note: "",
    method: "cash",
  });

  useEffect(() => {
    if (editing) {
      const { title, amount, category, date, note, method } = editing;
      setForm({
        title,
        amount: String(amount),
        category,
        date: date.slice(0, 10),
        note: note || "",
        method: method || "cash",
      });
    }
  }, [editing]);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }
  function submit(e) {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!form.title.trim()) return alert("กรอกชื่อรายการ");
    if (!amt || amt <= 0) return alert("กรอกจำนวนเงินให้ถูกต้อง");
    onSubmit({
      title: form.title.trim(),
      amount: amt,
      category: form.category,
      date: new Date(form.date).toISOString(),
      note: form.note?.trim(),
      method: form.method,
    });
    if (!editing) {
      // reset เมื่อเป็นการเพิ่มใหม่
      setForm((f) => ({ ...f, title: "", amount: "", note: "" }));
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h3>{editing ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}</h3>
      <div className="row">
        <div className="col-6">
          <label>ชื่อรายการ</label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="เช่น ข้าวแกง, Netflix"
          />
        </div>
        <div className="col-3">
          <label>จำนวนเงิน (฿)</label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="col-3">
          <label>วันที่</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>
        <div className="col-4">
          <label>หมวดหมู่</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-4">
          <label>วิธีจ่าย</label>
          <select
            value={form.method}
            onChange={(e) => update("method", e.target.value)}
          >
            <option value="cash">เงินสด</option>
            <option value="card">บัตร</option>
            <option value="transfer">โอน</option>
            <option value="wallet">วอลเล็ต</option>
          </select>
        </div>
        <div className="col-12">
          <label>หมายเหตุ (ถ้ามี)</label>
          <input
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="เลือกร้าน / เลขบิล ฯลฯ"
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn btn-primary btn-lg" type="submit">
          {editing ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn btn-ghost btn-lg"
            onClick={onCancel}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
