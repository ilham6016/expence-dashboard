import { useMemo } from "react";
import { categoryMap } from "../utils/categories";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

function sum(arr, fn) {
  return arr.reduce((a, b) => a + (fn ? fn(b) : b), 0);
}

export default function Dashboard({ items }) {
  const total = useMemo(() => sum(items, (x) => x.amount), [items]);
  const monthKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const byCat = useMemo(() => {
    const m = {};
    for (const x of items) {
      m[x.category] = (m[x.category] || 0) + x.amount;
    }
    return Object.entries(m)
      .map(([k, v]) => ({
        key: k,
        name: categoryMap[k]?.name || k,
        color: categoryMap[k]?.color || "#999",
        total: v,
      }))
      .sort((a, b) => b.total - a.total);
  }, [items]);

  const byMonth = useMemo(() => {
    const m = {};
    for (const x of items) {
      const k = monthKey(new Date(x.date));
      m[k] = (m[k] || 0) + x.amount;
    }
    const keys = Object.keys(m).sort();
    return { labels: keys, values: keys.map((k) => m[k]) };
  }, [items]);

  const top5 = byCat.slice(0, 5);

  return (
    <div className="panel">
      <h3>Dashboard สรุปผล</h3>
      <div className="cards" style={{ marginTop: 8 }}>
        <div className="card">
          <div className="label">รวมค่าใช้จ่าย</div>
          <div className="value">
            ฿ {total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="card">
          <div className="label">หมวดที่ใช้จ่ายมากสุด</div>
          <div className="value">{top5[0]?.name || "—"}</div>
        </div>
        <div className="card">
          <div className="label">Top 5 หมวด</div>
          <div className="value">
            {top5.map((x) => x.name).join(" · ") || "—"}
          </div>
        </div>
        <div className="card">
          <div className="label">จำนวนรายการ</div>
          <div className="value">{items.length.toLocaleString("th-TH")}</div>
        </div>
      </div>

      <div
        className="grid"
        style={{ marginTop: 12, gridTemplateColumns: "1.1fr .9fr", gap: 16 }}
      >
        <div className="panel">
          <h3>รายเดือน (Bar)</h3>
          <Bar
            data={{
              labels: byMonth.labels,
              datasets: [{ label: "รายจ่ายต่อเดือน", data: byMonth.values }],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
        <div className="panel">
          <h3>สัดส่วนตามหมวด (Pie)</h3>
          <Pie
            data={{
              labels: byCat.map((x) => x.name),
              datasets: [
                {
                  data: byCat.map((x) => x.total),
                  backgroundColor: byCat.map((x) => x.color),
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h3>แนวโน้ม (Line)</h3>
        <Line
          data={{
            labels: byMonth.labels,
            datasets: [
              {
                label: "Trend",
                data: byMonth.values,
                tension: 0.25,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
    </div>
  );
}
