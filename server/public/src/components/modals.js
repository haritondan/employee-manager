import selectors from "../selectors.js";
import { state, updateURL } from "../state.js";
import { fetchItemById } from "../api.js";

const {
  table: { rowId },
  modals: { formDialog, title, deleteDialog },
  forms: { itemForm },
  addEditInputs: {
    nameInput,
    emailInput,
    departmentInput,
    statusInput,
    roleInput,
  },
} = selectors;

let activeDeleteId = null;

export function getActiveDeleteId() {
  return activeDeleteId;
}

export function openAddModal() {
  resetFormValidation();
  itemForm.reset();
  rowId.value = "";
  title.textContent = "Add New Member";

  state.modal = "add";
  state.activeId = null;
  updateURL();

  formDialog.showModal();
}

export async function openEditModal(id) {
  resetFormValidation();
  state.modal = "edit";
  state.activeId = id;
  updateURL();

  try {
    const item = await fetchItemById(id);

    rowId.value = item.id;
    nameInput.value = item.name;
    emailInput.value = item.email;
    departmentInput.value = item.department;
    roleInput.value = item.role;
    statusInput.value = item.status;

    title.textContent = `Edit Member #${item.id}`;
    formDialog.showModal();
  } catch (err) {
    closeAllModals();
  }
}

export function openDeleteModal(id) {
  activeDeleteId = id;
  state.modal = "delete";
  state.activeId = id;
  updateURL();

  deleteDialog.showModal();
}

export function closeAllModals() {
  if (formDialog.open) formDialog.close();
  if (deleteDialog.open) deleteDialog.close();

  state.modal = null;
  state.activeId = null;
  updateURL();
}

export function handleModalStateFromURL() {
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

export function validateInput(input) {
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

export function clearInputError(input) {
  input.removeAttribute("aria-invalid");
  const errorSpan = document.getElementById(`${input.id}Error`);
  if (errorSpan) errorSpan.textContent = "";
}

export function resetFormValidation() {
  const inputs = itemForm.querySelectorAll("input, select");
  inputs.forEach((input) => clearInputError(input));
}
