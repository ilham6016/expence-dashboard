import CategoryBadge from "./CategoryBadge.jsx";
import { format } from "date-fns";

export default function ExpenseList({ items, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="panel">
        <h3>รายการค่าใช้จ่าย</h3>
        <div className="hr" />
        <div style={{ color: "#9aa3b2" }}>ยังไม่มีรายการในช่วงที่เลือก</div>
      </div>
    );
  }
  return (
    <div className="panel">
      <h3>รายการค่าใช้จ่าย ({items.length.toLocaleString("th-TH")} รายการ)</h3>
      <div className="hr" />
      <div className="list">
        {items.map((it) => (
          <div key={it.id} className="item">
            <div>
              <div className="title">{it.title}</div>
              <div className="sub">
                {new Date(it.date).toLocaleDateString("th-TH")} ·{" "}
                {it.method?.toUpperCase?.() || "—"} · {it.note || "—"}
              </div>
            </div>
            <CategoryBadge catKey={it.category} />
            <div style={{ textAlign: "right" }}>
              <div className="title">
                ฿{" "}
                {it.amount.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onEdit(it)}
                >
                  แก้ไข
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(it.id)}
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
