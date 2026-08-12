export async function fetchItems(params) {
  const query = new URLSearchParams(params);
  return apiFetch(`/api/records?${query.toString()}`);
}

export async function fetchItemById(id) {
  return apiFetch(`/api/records/${id}`);
}

export async function saveItem(id, payload) {
  const url = id ? `/api/records/${id}` : "/api/records";
  const method = id ? "PUT" : "POST";

  return apiFetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteItem(id) {
  return apiFetch(`/api/records/${id}`, { method: "DELETE" });
}

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);

    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;

      try {
        const errData = await res.json();
        if (errData?.errors?.length) {
          errorMessage = errData.errors.map((e) => e.msg).join(", ");
        } else if (errData?.message) {
          errorMessage = errData.message;
        }
      } catch {
        errorMessage = await res.text().catch(() => res.statusText);
      }

      throw new Error(errorMessage);
    }

    if (res.status === 204) return null;

    return await res.json();
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("An unexpected error occurred");
  }
}
