export async function fetchItems(params) {
  const query = new URLSearchParams(params);
  const res = await fetch(`/api/items?${query.toString()}`);
  if (!res.ok) throw new Error("Network response failed");
  return res.json();
}

export async function fetchItemById(id) {
  const res = await fetch(`/api/items/${id}`);
  if (!res.ok) throw new Error("Item not found");
  return res.json();
}

export async function saveItem(id, payload) {
  const url = id ? `/api/items/${id}` : "/api/items";
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Save operation failed");
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete operation failed");
  return res.json();
}
