import selectors from "../selectors.js";

const {
  pagination: { nextPageBtn, prevPageBtn, pagesContainer },
} = selectors;

export const renderPages = (pages = [1, 2, 3, 4], activePage = 1) => {
  pagesContainer.innerHTML = "";

  if (pages.length === 0) {
    pagesContainer.innerHTML = `<button class="page page-active" data-page="id">1</button>`;
  }

  pages.forEach((page) => {
    const button = document.createElement("button");
    button.dataset.page = page;
    button.classList.add("page");
    button.textContent = page;

    if (activePage === page) button.classList.add("page-active");

    pagesContainer.appendChild(button);
  });
};
