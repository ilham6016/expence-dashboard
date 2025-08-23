import { categoryMap } from "../utils/categories";

export default function CategoryBadge({ catKey }) {
  const cat = categoryMap[catKey] ?? { name: "ไม่ระบุ", color: "#999" };
  return (
    <span className="badge" title={cat.name}>
      <span className="dot" style={{ background: cat.color }} />
      {cat.name}
    </span>
  );
}
