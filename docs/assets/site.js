"use strict";

const state = {
  extensions: [],
  categories: [],
  activeCategory: "All",
  query: "",
  sortOrder: "name-asc",
};

const elements = {
  categoryList: document.querySelector("#category-list"),
  catalogHeading: document.querySelector("#catalog-heading"),
  catalogTotal: document.querySelector("#catalog-total"),
  emptyState: document.querySelector("#empty-state"),
  extensionList: document.querySelector("#extension-list"),
  resultCount: document.querySelector("#result-count"),
  search: document.querySelector("#extension-search"),
  sort: document.querySelector("#sort-order"),
};

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function makePlaceholder(name) {
  const placeholder = createElement("span", "extension-icon-placeholder", initials(name));
  placeholder.setAttribute("aria-hidden", "true");
  return placeholder;
}

function compareText(left, right) {
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function getVisibleExtensions() {
  const query = state.query.trim().toLowerCase();
  const filtered = state.extensions.filter((extension) => {
    const matchesCategory = state.activeCategory === "All" || extension.category === state.activeCategory;
    const searchable = [
      extension.name,
      extension.version,
      extension.filename,
      extension.author,
      extension.category,
      extension.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesCategory && (!query || searchable.includes(query));
  });

  return filtered.sort((left, right) => {
    if (state.sortOrder === "name-desc") return compareText(right.name, left.name);
    if (state.sortOrder === "author-asc") {
      return compareText(left.author, right.author) || compareText(left.name, right.name);
    }
    if (state.sortOrder === "author-desc") {
      return compareText(right.author, left.author) || compareText(left.name, right.name);
    }
    return compareText(left.name, right.name);
  });
}

function renderCategories() {
  elements.categoryList.replaceChildren();
  const definitions = [
    { name: "All", label: "All extensions", count: state.extensions.length },
    ...state.categories.map((category) => ({
      name: category.name,
      label: category.name,
      count: state.extensions.filter((extension) => extension.category === category.name).length,
    })),
  ];

  definitions.forEach((category) => {
    const item = document.createElement("li");
    const button = createElement("button", "category-button");
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.activeCategory === category.name));
    button.append(
      createElement("span", "", category.label),
      createElement("span", "category-count", String(category.count)),
    );
    button.addEventListener("click", () => {
      state.activeCategory = category.name;
      renderCategories();
      renderExtensions();
    });
    item.append(button);
    elements.categoryList.append(item);
  });
}

function makeExtensionRow(extension) {
  const row = createElement("li", "extension-row");

  if (extension.icon) {
    const icon = createElement("img", "extension-icon-image");
    icon.src = `./assets/extension-icons/${encodeURIComponent(extension.icon)}`;
    icon.width = 32;
    icon.height = 32;
    icon.alt = "";
    icon.loading = "lazy";
    icon.addEventListener("error", () => icon.replaceWith(makePlaceholder(extension.name)), { once: true });
    row.append(icon);
  } else {
    row.append(makePlaceholder(extension.name));
  }

  const copy = createElement("div", "extension-copy");
  const name = createElement("h3", "extension-name", extension.name);
  if (extension.version) {
    name.append(createElement("span", "extension-version", ` (${extension.version})`));
  }
  copy.append(name, createElement("p", "extension-description", extension.description));
  row.append(copy);

  const author = createElement("div", "meta-cell meta-author");
  author.append(createElement("span", "meta-label", "Author"));
  if (extension.authorUrl) {
    const link = createElement("a", "author-link", extension.author);
    link.href = extension.authorUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    author.append(link);
  } else {
    author.append(document.createTextNode(extension.author));
  }
  row.append(author);

  const category = createElement("div", "meta-cell meta-category");
  category.append(
    createElement("span", "meta-label", "Category"),
    createElement("span", "category-tag", extension.category),
  );
  row.append(category);

  const file = createElement("a", "file-link", extension.filename);
  if (extension.downloadUrl) {
    file.href = extension.downloadUrl;
    file.target = "_blank";
    file.rel = "noopener noreferrer";
  } else {
    file.href = `./downloads/${encodeURIComponent(extension.filename)}`;
    file.download = extension.filename;
  }
  file.setAttribute("aria-label", `Download ${extension.filename}`);
  row.append(file);

  return row;
}

function renderExtensions() {
  const visible = getVisibleExtensions();
  elements.catalogHeading.textContent = state.activeCategory === "All" ? "All extensions" : state.activeCategory;
  elements.resultCount.textContent = `${visible.length} ${visible.length === 1 ? "entry" : "entries"}`;
  elements.extensionList.replaceChildren(...visible.map(makeExtensionRow));
  elements.extensionList.hidden = visible.length === 0;
  elements.emptyState.hidden = visible.length !== 0;
}

async function initialize() {
  try {
    const [extensionsResponse, categoriesResponse] = await Promise.all([
      fetch("./data/extensions.json"),
      fetch("./data/categories.json"),
    ]);

    if (!extensionsResponse.ok || !categoriesResponse.ok) throw new Error("Catalog data could not be loaded.");
    state.extensions = await extensionsResponse.json();
    state.categories = await categoriesResponse.json();

    elements.catalogTotal.textContent = `${state.extensions.length} cataloged extensions`;
    renderCategories();
    renderExtensions();
  } catch (error) {
    elements.catalogTotal.textContent = "Catalog unavailable";
    elements.resultCount.textContent = "Unable to load entries";
    elements.extensionList.hidden = true;
    elements.emptyState.hidden = false;
    elements.emptyState.textContent = "The extension catalog could not be loaded. Please refresh the page.";
    console.error(error);
  }
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderExtensions();
});

elements.sort.addEventListener("change", (event) => {
  state.sortOrder = event.target.value;
  renderExtensions();
});

initialize();
