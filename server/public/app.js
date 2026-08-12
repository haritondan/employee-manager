import selectors from "./src/selectors.js";
import { state, syncStateFromURL, updateURL } from "./src/state.js";
import { fetchItems, saveItem, deleteItem } from "./src/api.js";
import { renderTable, updateSortIcons } from "./src/components/table.js";
import {
  openAddModal,
  openEditModal,
  openDeleteModal,
  closeAllModals,
  handleModalStateFromURL,
  validateInput,
  clearInputError,
  getActiveDeleteId,
} from "./src/components/modals.js";
import { changePage, renderPages } from "./src/components/pagination.js";
import { showErrorToast } from "./src/components/errorToast.js";

document.addEventListener("DOMContentLoaded", () => {
  let searchTimeout = null;

  const {
    table: { body, sortableColumns, rowId },
    inputs: { searchInput },
    btns: { confirmDeleteBtn, openAddBtn },
    modals: { formDialog, deleteDialog, closeModalBtns },
    forms: { itemForm, formInputs, errorMsg },
    addEditInputs: {
      nameInput,
      emailInput,
      departmentInput,
      statusInput,
      roleInput,
    },
    pagination: { pagesContainer, limit, prevPageBtn, nextPageBtn },
  } = selectors;

  async function fetchAndRender() {
    try {
      const { data, pagination } = await fetchItems({
        search: state.search,
        sortBy: state.sortBy,
        order: state.order,
        page: state.page,
        limit: state.limit,
      });
      renderTable(data);
      renderPages(pagination);
    } catch (err) {
      showErrorToast(err);
      console.error(err);
    }
  }

  function handleSyncAndRender() {
    syncStateFromURL();
    searchInput.value = state.search;
    updateSortIcons();
    fetchAndRender();
    handleModalStateFromURL();
  }

  window.addEventListener("popstate", handleSyncAndRender);

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    state.search = e.target.value.trim();

    searchTimeout = setTimeout(() => {
      state.page = 1;
      updateURL();
      fetchAndRender();
    }, 300);
  });

  sortableColumns.forEach((th) => {
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

  body.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "edit") openEditModal(id);
    if (action === "delete") openDeleteModal(id);
  });

  openAddBtn.addEventListener("click", openAddModal);

  [formDialog, deleteDialog].forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();
      const isClickInside =
        (e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom) ||
        statusInput.contains(e.target);

      if (!isClickInside) closeAllModals();
    });

    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeAllModals();
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  formInputs.forEach((input) => {
    input.addEventListener("blur", () => validateInput(input));
    input.addEventListener("input", () => clearInputError(input));
  });

  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    formInputs.forEach((input) => {
      if (!validateInput(input)) isValid = false;
    });

    if (!isValid) return;

    const id = rowId.value;
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      department: departmentInput.value.trim(),
      role: roleInput.value.trim(),
      status: statusInput.value,
    };

    try {
      await saveItem(id, payload);
      closeAllModals();
      fetchAndRender();
    } catch (err) {
      errorMsg.textContent = err.message;
      console.error(err);
    }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    const id = getActiveDeleteId();
    if (!id) return;

    try {
      await deleteItem(id);
      closeAllModals();
      fetchAndRender();
    } catch (err) {
      console.error(err);
    }
  });

  pagesContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-page]");
    if (!btn) return;

    const page = parseInt(btn.dataset.page);
    if (page) {
      state.page = page;
      updateURL();
      fetchAndRender();
    }
  });

  limit.addEventListener("change", (e) => {
    e.preventDefault();

    state.limit = parseInt(e.target.value);
    state.page = 1;
    updateURL();
    fetchAndRender();
  });

  prevPageBtn.addEventListener("click", () => {
    changePage(state.page - 1);
    fetchAndRender();
  });

  nextPageBtn.addEventListener("click", () => {
    changePage(state.page + 1);
    fetchAndRender();
  });

  handleSyncAndRender();
});
