import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import ExpenseForm from "./components/ExpenseForm.jsx";
import FiltersBar from "./components/FiltersBar.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Dashboard from "./components/Dashboard.jsx";
import "./App.css";
import {
  loadExpenses,
  saveExpenses,
  exportJSON,
  importJSON,
} from "./utils/storage.js";
import { CATEGORIES } from "./utils/categories.js";

function applyFilters(list, f) {
  let out = [...list];
  if (f.from) {
    const a = new Date(f.from).setHours(0, 0, 0, 0);
    out = out.filter((x) => new Date(x.date) >= a);
  }
  if (f.to) {
    const b = new Date(f.to).setHours(23, 59, 59, 999);
    out = out.filter((x) => new Date(x.date) <= b);
  }
  if (f.category) {
    out = out.filter((x) => x.category === f.category);
  }
  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter(
      (x) =>
        x.title.toLowerCase().includes(q) || x.note?.toLowerCase().includes(q)
    );
  }
  switch (f.sort) {
    case "date_asc":
      out.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "amount_desc":
      out.sort((a, b) => b.amount - a.amount);
      break;
    case "amount_asc":
      out.sort((a, b) => a.amount - b.amount);
      break;
    case "title_asc":
      out.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      out.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return out;
}

const demoSeed = [
  {
    id: nanoid(),
    title: "ข้าวกะเพรา",
    amount: 65,
    category: "food",
    date: new Date().toISOString(),
    method: "cash",
    note: "ร้านปากซอย",
  },
  {
    id: nanoid(),
    title: "รถไฟฟ้า",
    amount: 42,
    category: "transport",
    date: new Date().toISOString(),
    method: "card",
  },
  {
    id: nanoid(),
    title: "Netflix",
    amount: 139,
    category: "ent",
    date: new Date().toISOString(),
    method: "card",
  },
  {
    id: nanoid(),
    title: "ค่าน้ำ",
    amount: 130,
    category: "bill",
    date: new Date(new Date().setDate(1)).toISOString(),
    method: "transfer",
  },
];

export default function App() {
  const [items, setItems] = useState(() =>
    loadExpenses().length ? loadExpenses() : demoSeed
  );
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    category: null,
    sort: "date_desc",
    q: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    saveExpenses(items);
  }, [items]);

  function addOrUpdate(payload) {
    if (editing) {
      setItems((list) =>
        list.map((x) => (x.id === editing.id ? { ...x, ...payload } : x))
      );
      setEditing(null);
    } else {
      setItems((list) => [{ id: nanoid(), ...payload }, ...list]);
    }
  }
  function onEdit(it) {
    setEditing(it);
  }
  function onDelete(id){
  if (window.confirm('ลบรายการนี้ใช่ไหม?')) {
    setItems(list => list.filter(x => x.id !== id))
  }
}
  function onExport() {
    exportJSON(items);
  }
  async function onImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const data = await importJSON(file);
        if (!Array.isArray(data)) throw new Error("รูปแบบไฟล์ไม่ถูกต้อง");
        // ทำความสะอาดข้อมูลขั้นต่ำ
        const cleaned = data
          .map((x) => ({
            id: x.id || nanoid(),
            title: String(x.title || "").trim() || "รายการ",
            amount: Number(x.amount) || 0,
            category:
              CATEGORIES.find((c) => c.key === x.category)?.key || "other",
            date: x.date
              ? new Date(x.date).toISOString()
              : new Date().toISOString(),
            note: x.note || "",
            method: x.method || "cash",
          }))
          .filter((x) => x.amount > 0);
        setItems(cleaned);
        alert("นำเข้าข้อมูลสำเร็จ");
      } catch (e) {
        alert("นำเข้าไม่สำเร็จ: " + e.message);
      }
    };
    input.click();
  }

  const filtered = useMemo(
    () => applyFilters(items, filters),
    [items, filters]
  );

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          margin: "8px 0 16px 0",
        }}
      >
<h1
  style={{all: "unset",fontSize: "24px",fontWeight: 800,letterSpacing: ".3px", paddingLeft: "10px"}}>
  Xpensely
</h1>
        <div style={{ color: "#9aa3b2" }}>
          ระบบการบันทึกรายจ่ายในชีวิตประจำวัน
        </div>
      </div>

      <div className="grid grid-2">
        <div className="grid" style={{ gap: 16 }}>
          <ExpenseForm
            onSubmit={addOrUpdate}
            editing={editing}
            onCancel={() => setEditing(null)}
          />
          <FiltersBar
            filters={filters}
            setFilters={setFilters}
            onExport={onExport}
            onImport={onImport}
          />
          <ExpenseList items={filtered} onEdit={onEdit} onDelete={onDelete} />
        </div>
        <Dashboard items={filtered} />
      </div>
    </div>
  );
}
