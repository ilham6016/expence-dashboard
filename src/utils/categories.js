export const CATEGORIES = [
  { key: "food", name: "อาหาร", color: "#ff7675" },
  { key: "grocery", name: "ของใช้/ซูเปอร์", color: "#f8c291" },
  { key: "transport", name: "เดินทาง", color: "#74b9ff" },
  { key: "bill", name: "บิล & ค่าสาธารณูปโภค", color: "#55efc4" },
  { key: "ent", name: "บันเทิง", color: "#a29bfe" },
  { key: "health", name: "สุขภาพ", color: "#81ecec" },
  { key: "edu", name: "การศึกษา", color: "#fab1a0" },
  { key: "other", name: "อื่นๆ", color: "#ffeaa7" },
];
export const categoryMap = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
);
