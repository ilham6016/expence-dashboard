import { useState } from "react";
import CategoryBadge from "./CategoryBadge.jsx";

export default function ExpenseList({ items, onEdit, onDelete }) {
  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIdx, endIdx);

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
        {paginatedItems.map((it) => (
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
          gap: 5,
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ ก่อนหน้า
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`btn btn-sm ${
              num === currentPage ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          ถัดไป ▶
        </button>
      </div>
    </div>
  );
}
