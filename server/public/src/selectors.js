export default {
  table: {
    body: document.getElementById("tableBody"),
    noResults: document.getElementById("noResults"),
    rowId: document.getElementById("itemId"),
    sortableColumns: document.querySelectorAll("th.sortable"),
  },
  inputs: {
    searchInput: document.getElementById("searchInput"),
  },
  modals: {
    formDialog: document.getElementById("formDialog"),
    title: document.getElementById("modalTitle"),
    deleteDialog: document.getElementById("deleteDialog"),
    closeModalBtns: document.querySelectorAll("[data-close-modal]"),
  },
  btns: {
    confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
    openAddBtn: document.getElementById("openAddBtn"),
  },
  forms: {
    itemForm: document.getElementById("itemForm"),
    formInputs: itemForm.querySelectorAll("input, select"),
  },
  addEditInputs: {
    nameInput: document.getElementById("name"),
    emailInput: document.getElementById("email"),
    departmentInput: document.getElementById("department"),
    roleInput: document.getElementById("role"),
    statusInput: document.getElementById("status"),
  },
  pagination: {
    prevPageBtn: document.getElementById("prevPage"),
    nextPageBtn: document.getElementById("nextPage"),
    pagesContainer: document.getElementById("pagesContainer"),
    limit: document.getElementById("limit"),
  },
};
