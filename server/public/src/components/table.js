import selectors from "../selectors.js";
import { escapeHTML } from "../utils.js";
import { state } from "../state.js";

const {
  table: { body, noResults, sortableColumns },
} = selectors;

export function renderTable(items) {
  body.innerHTML = "";

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
    body.appendChild(tr);
  });
}

export function updateSortIcons() {
  sortableColumns.forEach((th) => {
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
