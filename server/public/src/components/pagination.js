import selectors from "../selectors.js";
import { state, updateURL } from "../state.js";

const {
  pagination: { nextPageBtn, prevPageBtn, pagesContainer },
} = selectors;

export const renderPages = (pagination) => {
  const { totalPages, currentPage, hasNextPage, hasPrevPage } = pagination;

  pagesContainer.innerHTML = "";

  if (!totalPages || totalPages <= 0) {
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    pagesContainer.innerHTML = `<button class="page page-active" data-page="id">1</button>`;
    return;
  }

  prevPageBtn.disabled = !hasPrevPage;
  nextPageBtn.disabled = !hasNextPage;

  const pages = getPageNumbers(Number(currentPage), Number(totalPages));

  pages.forEach((page) => {
    if (page === "...") {
      const span = document.createElement("span");
      span.className = "page-dots";
      span.textContent = "...";
      pagesContainer.appendChild(span);
    } else {
      const button = document.createElement("button");
      button.className = `page ${Number(currentPage) === page ? "page-active" : ""}`;
      button.dataset.page = page;
      button.textContent = page;
      pagesContainer.appendChild(button);
    }
  });
};

function getPageNumbers(currentPage, totalPages, delta = 1) {
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export const changePage = async (newPage) => {
  if (
    newPage === state.currentPage ||
    newPage < 1 ||
    newPage > state.totalPages
  ) {
    return;
  }

  state.page = newPage;
  updateURL();
};
