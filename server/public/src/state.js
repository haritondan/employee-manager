export const state = {
  search: "",
  sortBy: "id",
  order: "asc",
  modal: null, // null | 'add' | 'edit' | 'delete'
  activeId: null,
  page: 1,
  limit: 10,
};

export function syncStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  state.search = params.get("search") || "";
  state.sortBy = params.get("sortBy") || "id";
  state.order = params.get("order") || "asc";
  state.modal = params.get("modal") || null;
  state.activeId = params.get("id") || null;
  state.page = params.get("page") || 1;
  state.limit = params.get("limit") || 10;
}

export function updateURL() {
  const params = new URLSearchParams();
  if (state.search) params.set("search", state.search);
  if (state.sortBy !== "id") params.set("sortBy", state.sortBy);
  if (state.order !== "asc") params.set("order", state.order);
  if (state.modal) params.set("modal", state.modal);
  if (state.activeId) params.set("id", state.activeId);
  if (state.page !== 1) params.set("page", state.page);
  if (state.limit !== 10) params.set("limit", state.limit);

  const newUrl = params.toString()
    ? `?${params.toString()}`
    : window.location.pathname;
  history.pushState(state, "", newUrl);
}
