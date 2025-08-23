const KEY = "xpenses:v1";

export function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}
export function saveExpenses(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function exportJSON(list) {
  const blob = new Blob([JSON.stringify(list, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
export function importJSON(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        res(JSON.parse(r.result));
      } catch (e) {
        rej(e);
      }
    };
    r.onerror = rej;
    r.readAsText(file);
  });
}
