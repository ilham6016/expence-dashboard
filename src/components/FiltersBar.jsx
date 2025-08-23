import { CATEGORIES } from "../utils/categories";
import { format } from "date-fns";

export default function FiltersBar({
  filters,
  setFilters,
  onExport,
  onImport,
}) {
  function upd(k, v) {
    setFilters((s) => ({ ...s, [k]: v }));
  }

  return (
    <div className="panel">
      <h3>ค้นหา / กรอง / เรียง</h3>
      <div className="toolbar">
        <div>
          <label>ช่วงวันที่เริ่ม</label>
          <input
            type="date"
            value={filters.from || ""}
            onChange={(e) => upd("from", e.target.value)}
          />
        </div>
        <div>
          <label>ถึง</label>
          <input
            type="date"
            value={filters.to || ""}
            onChange={(e) => upd("to", e.target.value)}
          />
        </div>
        <div>
          <label>หมวดหมู่</label>
          <select
            value={filters.category || ""}
            onChange={(e) => upd("category", e.target.value || null)}
          >
            <option value="">ทั้งหมด</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>การเรียง</label>
          <select
            value={filters.sort}
            onChange={(e) => upd("sort", e.target.value)}
          >
            <option value="date_desc">วันที่ใหม่ → เก่า</option>
            <option value="date_asc">วันที่เก่า → ใหม่</option>
            <option value="amount_desc">จำนวนเงินมาก → น้อย</option>
            <option value="amount_asc">จำนวนเงินน้อย → มาก</option>
            <option value="title_asc">ชื่อ A → Z</option>
          </select>
        </div>
        <div>
          <label>&nbsp;</label>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() =>
              setFilters({
                from: "",
                to: "",
                category: null,
                sort: "date_desc",
                q: "",
              })
            }
          >
            ล้างตัวกรอง
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <div>
          <label>ค้นหาชื่อ</label>
          <input
            placeholder="พิมพ์คำค้น..."
            value={filters.q}
            onChange={(e) => upd("q", e.target.value)}
          />
        </div>
        <div>
          <label>&nbsp;</label>
          <button className="btn btn-ghost btn-sm" onClick={onExport}>
            Export JSON
          </button>
        </div>
        <div>
          <label>&nbsp;</label>
          <button className="btn btn-ghost btn-sm" onClick={onImport}>
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}
