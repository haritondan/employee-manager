document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const state = {
    search: "",
    sortBy: "id",
    order: "asc",
    modal: null, // null | 'add' | 'edit' | 'delete'
    activeId: null,
  };

  let searchTimeout = null;
  let activeDeleteId = null;

  // DOM Element References
  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");
  const noResults = document.getElementById("noResults");

  const formDialog = document.getElementById("formDialog");
  const itemForm = document.getElementById("itemForm");
  const modalTitle = document.getElementById("modalTitle");
  const statusSelect = document.getElementById("status");

  const deleteDialog = document.getElementById("deleteDialog");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const openAddBtn = document.getElementById("openAddBtn");

  // ---------------------------------------------------------------------------
  // INITIALIZATION & URL STATE SYNC (Req 6)
  // ---------------------------------------------------------------------------
  function syncStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    state.search = params.get("search") || "";
    state.sortBy = params.get("sortBy") || "id";
    state.order = params.get("order") || "asc";
    state.modal = params.get("modal") || null;
    state.activeId = params.get("id") || null;

    searchInput.value = state.search;
    updateSortIcons();
  }

  function updateURL() {
    const params = new URLSearchParams();
    if (state.search) params.set("search", state.search);
    if (state.sortBy !== "id") params.set("sortBy", state.sortBy);
    if (state.order !== "asc") params.set("order", state.order);
    if (state.modal) params.set("modal", state.modal);
    if (state.activeId) params.set("id", state.activeId);

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    history.pushState(state, "", newUrl);
  }

  // Handle browser Back/Forward navigation
  window.addEventListener("popstate", () => {
    syncStateFromURL();
    fetchAndRender();
    handleModalStateFromURL();
  });

  async function fetchAndRender() {
    try {
      const query = new URLSearchParams({
        search: state.search,
        sortBy: state.sortBy,
        order: state.order,
      });

      const res = await fetch(`/api/items?${query.toString()}`);
      if (!res.ok) throw new Error("Network response failed");
      const items = await res.json();

      renderTable(items);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  function renderTable(items) {
    tableBody.innerHTML = "";

    if (items.length === 0) {
      noResults.classList.remove("hidden");
      return;
    }
    noResults.classList.add("hidden");

    items.forEach((item) => {
      const tr = document.createElement("tr");
      const statusClass = `badge-${item.status.toLowerCase()}`;

      tr.innerHTML = `
        <td data-label="ID">${item.id}</td>
        <td data-label="Name"><strong>${escapeHTML(item.name)}</strong></td>
        <td data-label="Email">${escapeHTML(item.email)}</td>
        <td data-label="Department">${escapeHTML(item.department)}</td>
        <td data-label="Role">${escapeHTML(item.role)}</td>
        <td data-label="Status"><span class="badge ${statusClass}">${escapeHTML(item.status)}</span></td>
        <td data-label="Actions">
          <div class="action-buttons">
            <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${item.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-action="delete" data-id="${item.id}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    state.search = e.target.value.trim();

    searchTimeout = setTimeout(() => {
      updateURL();
      fetchAndRender();
    }, 300);
  });

  document.querySelectorAll("th.sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const column = th.dataset.sort;
      if (state.sortBy === column) {
        state.order = state.order === "asc" ? "desc" : "asc";
      } else {
        state.sortBy = column;
        state.order = "asc";
      }
      updateSortIcons();
      updateURL();
      fetchAndRender();
    });
  });

  function updateSortIcons() {
    document.querySelectorAll("th.sortable").forEach((th) => {
      const icon = th.querySelector(".sort-icon");
      if (th.dataset.sort === state.sortBy) {
        icon.textContent = state.order === "asc" ? "▲" : "▼";
        th.style.opacity = "1.0";
      } else {
        icon.textContent = "↕";
        th.style.opacity = "0.7";
      }
    });
  }

  function openAddModal() {
    resetFormValidation();
    itemForm.reset();
    document.getElementById("itemId").value = "";
    modalTitle.textContent = "Add New Member";

    state.modal = "add";
    state.activeId = null;
    updateURL();

    formDialog.showModal();
  }

  async function openEditModal(id) {
    resetFormValidation();
    state.modal = "edit";
    state.activeId = id;
    updateURL();

    try {
      const res = await fetch(`/api/items/${id}`);
      if (!res.ok) throw new Error("Item not found");
      const item = await res.json();

      document.getElementById("itemId").value = item.id;
      document.getElementById("name").value = item.name;
      document.getElementById("email").value = item.email;
      document.getElementById("department").value = item.department;
      document.getElementById("role").value = item.role;
      document.getElementById("status").value = item.status;

      modalTitle.textContent = `Edit Member #${item.id}`;
      formDialog.showModal();
    } catch (err) {
      closeAllModals();
    }
  }

  function openDeleteModal(id) {
    activeDeleteId = id;
    state.modal = "delete";
    state.activeId = id;
    updateURL();

    deleteDialog.showModal();
  }

  function closeAllModals() {
    if (formDialog.open) formDialog.close();
    if (deleteDialog.open) deleteDialog.close();

    state.modal = null;
    state.activeId = null;
    updateURL();
  }

  function handleModalStateFromURL() {
    if (state.modal === "add") {
      openAddModal();
    } else if (state.modal === "edit" && state.activeId) {
      openEditModal(state.activeId);
    } else if (state.modal === "delete" && state.activeId) {
      openDeleteModal(state.activeId);
    } else {
      if (formDialog.open) formDialog.close();
      if (deleteDialog.open) deleteDialog.close();
    }
  }

  // Requirement 3: Close modal on backdrop click or close elements
  [formDialog, deleteDialog].forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();

      const isClickInside =
        (e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom) ||
        statusSelect.contains(e.target);

      if (!isClickInside) {
        closeAllModals();
      }
    });

    // Native ESC key handler syncs state back to URL
    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeAllModals();
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  // Event Delegation for Table Row Action Buttons
  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "edit") openEditModal(id);
    if (action === "delete") openDeleteModal(id);
  });

  openAddBtn.addEventListener("click", openAddModal);

  // ---------------------------------------------------------------------------
  // FORM VALIDATION & SUBMISSION (Req 10)
  // ---------------------------------------------------------------------------
  const inputs = itemForm.querySelectorAll("input, select");

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateInput(input));
    input.addEventListener("input", () => clearInputError(input));
  });

  function validateInput(input) {
    if (input.type === "hidden") return true;

    const errorSpan = document.getElementById(`${input.id}Error`);
    if (!input.checkValidity()) {
      input.setAttribute("aria-invalid", "true");
      if (errorSpan) errorSpan.textContent = input.validationMessage;
      return false;
    }

    clearInputError(input);
    return true;
  }

  function clearInputError(input) {
    input.removeAttribute("aria-invalid");
    const errorSpan = document.getElementById(`${input.id}Error`);
    if (errorSpan) errorSpan.textContent = "";
  }

  function resetFormValidation() {
    inputs.forEach((input) => clearInputError(input));
  }

  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) isValid = false;
    });

    if (!isValid) return;

    const id = document.getElementById("itemId").value;
    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      role: document.getElementById("role").value.trim(),
      status: document.getElementById("status").value,
    };

    try {
      const url = id ? `/api/items/${id}` : "/api/items";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save operation failed");

      closeAllModals();
      fetchAndRender();
    } catch (err) {
      console.error(err);
    }
  });

  // Handle Delete Confirmation
  confirmDeleteBtn.addEventListener("click", async () => {
    if (!activeDeleteId) return;

    try {
      const res = await fetch(`/api/items/${activeDeleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete operation failed");

      closeAllModals();
      fetchAndRender();
    } catch (err) {
      console.error(err);
    }
  });

  // XSS Defense Utility
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Boot sequence
  syncStateFromURL();
  fetchAndRender();
  handleModalStateFromURL();
});
