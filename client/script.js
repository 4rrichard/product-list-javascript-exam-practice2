import { products } from "./data.js";

const loadEvent = function () {
  const rootElement = document.getElementById("root");
  const originalProducts = [...products];
  const selectedTracks = [];
  productMainDetails(rootElement, originalProducts, selectedTracks);
};

function productMainDetails(rootElement, originalProducts, selectedTracks) {
  let calcButtonCreated = false;

  createSelectElement(rootElement, originalProducts);
  createSearchFilter(rootElement, originalProducts);

  const buttonElements = [{ tag: "button", text: "List the vendors" }];

  const listVendorButtonElementTree = createElements(
    buttonElements,
    rootElement
  );
  listVendorButtonElementTree.children[0].addEventListener("click", (event) => {
    removeElements(event, rootElement, originalProducts);
  });

  originalProducts.forEach((product) => {
    const productElements = [
      { tag: "h1", text: `Album name: ${product.name}` },
      { tag: "h2", text: `Status: ${product.status}` },
      { tag: "h3", text: `Price: ${product.price}` },
    ];

    const productElementTree = createElements(productElements);

    productSubDetails(
      productElementTree.parent,
      product,
      rootElement,
      selectedTracks,
      calcButtonCreated
    );
    rootElement.appendChild(productElementTree.parent);
  });
}

function productSubDetails(
  parentContainer,
  product,
  rootElement,
  selectedTracks,
  calcButtonCreated
) {
  product.details.forEach((details) => {
    const detailElements = [
      { tag: "h2", text: `Track name: ${details.name}` },
      { tag: "h3", text: `Track id: ${details.track_id}` },
      { tag: "h4", text: `Album id: ${details.album_id}` },
      { tag: "button", text: "Add list for calculation" },
    ];
    const detailElementTree = createElements(detailElements);

    detailElementTree.children[3].addEventListener("click", (event) => {
      handleAddToFavs(
        event,
        details,
        rootElement,
        selectedTracks,
        calcButtonCreated
      );
      calcButtonCreated = true;
    });
    parentContainer.append(...detailElementTree.children);
  });
}

function handleAddToFavs(
  event,
  details,
  rootElement,
  selectedTracks,
  calcButtonCreated
) {
  event.preventDefault();

  selectedTracks.push(details.milliseconds);

  if (!calcButtonCreated) {
    createCalcButton(selectedTracks, rootElement);
  }
}

function createCalcButton(selectedTracks, rootElement) {
  const calcAverageButtonElements = [
    { tag: "button", text: "Calculate average duration" },
  ];

  const calcButtonTree = createElements(calcAverageButtonElements);

  calcButtonTree.children[0].addEventListener("click", (e) => {
    calcButtonHandle(e, selectedTracks, calcButtonTree.parent);
  });

  rootElement.prepend(calcButtonTree.parent);
}

function calcButtonHandle(event, selectedTracks, parent) {
  event.preventDefault();
  const sumTrackLengths =
    selectedTracks.length === 1
      ? selectedTracks[0]
      : selectedTracks.reduce((total, currentLength) => {
          return total + currentLength;
        });

  const convertToTimeFormat = new Date(sumTrackLengths * 1000)
    .toISOString()
    .slice(11, -5);

  if (parent.children.length === 1) {
    const averageLengthElements = [
      {
        tag: "p",
        text: `The average length of the selected tracks: ${convertToTimeFormat}`,
      },
    ];

    createElements(averageLengthElements, parent);
  } else {
    parent.children[1].textContent = `The average length of the selected tracks: ${convertToTimeFormat}`;
  }
}

function collectVendorNames(originalProducts) {
  const filteredVendorNames = new Set(
    originalProducts.map((product) => product.vendor.name)
  );
  return filteredVendorNames;
}

function clearChildren(parent) {
  while (parent.lastElementChild) {
    parent.removeChild(parent.lastElementChild);
  }
}

function removeElements(event, rootElement) {
  event.preventDefault();

  clearChildren(rootElement);
  createVendorList(rootElement, originalProducts);
}

function createVendorList(rootElement, originalProducts) {
  const listUlElements = [{ tag: "ul", text: "" }];

  const listContainer = createElements(listUlElements, rootElement);

  const allVendorNames = [...collectVendorNames(originalProducts)];

  allVendorNames.forEach((vendor) => {
    const vendorNameElements = [{ tag: "li", text: "" }];

    const vendorListElement = createElements(
      vendorNameElements,
      listContainer.children[0]
    );

    const linkedVendorElements = [{ tag: "a", text: vendor }];

    const linkedVendor = createElements(
      linkedVendorElements,
      vendorListElement.children[0]
    );

    linkedVendor.children[0].addEventListener("click", (event) => {
      showClickedVendorAlbums(event, rootElement, originalProducts);
    });
  });
}

function showClickedVendorAlbums(event, rootElement, originalProducts) {
  event.preventDefault();

  const vendorName = event.target.textContent;
  const filteredAlbums = originalProducts.filter(
    (album) => album.vendor.name === vendorName
  );

  clearChildren(rootElement);

  const albumVendorSiteElement = [
    { tag: "button", text: "Back" },
    { tag: "h1", text: vendorName },
  ];

  const albumVendorSiteTreeElements = createElements(
    albumVendorSiteElement,
    rootElement
  );

  const backButtonElement = albumVendorSiteTreeElements.children[0];

  backButtonElement.addEventListener("click", (event) => {
    removeElements(event, rootElement, originalProducts);
  });

  filteredAlbums.forEach((album) => {
    const albumVendorElement = [{ tag: "h2", text: album.name }];
    createElements(albumVendorElement, rootElement);
  });
}

function createSearchFilter(rootElement, originalProducts) {
  const formElement = [{ tag: "form", text: "" }];

  const formElementTree = createElements(formElement, rootElement);

  formElementTree.children[0].setAttribute("id", "price-search-form");
  formElementTree.children[0].classList.add("persistent-ui");

  const searchBarElements = [
    { tag: "input", text: "" },
    { tag: "button", text: "Filter by price" },
  ];

  const searchBarTreeElements = createElements(
    searchBarElements,
    formElementTree.children[0]
  );

  searchBarTreeElements.children[0].setAttribute("name", "priceInput");
  searchBarTreeElements.children[0].setAttribute("type", "number");

  searchBarTreeElements.children[1].setAttribute("type", "submit");

  searchBarTreeElements.parent.addEventListener("submit", (event) => {
    handleSearch(event, rootElement, originalProducts);
  });
}

function handleSearch(event, rootElement, originalProducts) {
  event.preventDefault();

  let inputFieldValue = parseInt(
    document.querySelector("[name='priceInput']").value,
    10
  );

  const filteredAlbums = originalProducts.filter(
    (product) => product.price < inputFieldValue
  );

  [...rootElement.children].forEach((child) => {
    if (!child.classList.contains("persistent-ui")) {
      rootElement.removeChild(child);
    }
  });

  filteredAlbums.forEach((product) => {
    const productElements = [
      { tag: "h1", text: `Album name: ${product.name}` },
      { tag: "h2", text: `Status: ${product.status}` },
      { tag: "h3", text: `Price: ${product.price}` },
    ];
    const productElementTree = createElements(productElements);
    productSubDetails(productElementTree.parent, product);
    rootElement.appendChild(productElementTree.parent);
  });

  document.getElementById("price-search-form").reset();
}

function createSelectElement(rootElement, originalProducts) {
  const selectElement = [{ tag: "select", text: "" }];

  const selectElementTree = createElements(selectElement, rootElement);

  selectElementTree.children[0].setAttribute("name", "letters");

  selectElementTree.children[0].classList.add("persistent-ui");

  const alphabet = [];

  const firstOptionElement = [
    { tag: "option", text: "Choose a starting letter" },
  ];

  const firstOptionElementTree = createElements(
    firstOptionElement,
    selectElementTree.children[0]
  );

  firstOptionElementTree.children[0].setAttribute("disabled", true);

  for (let i = 0; i < 26; i++) {
    alphabet.push(String.fromCharCode(65 + i));
  }

  alphabet.forEach((letter) => {
    const optionElements = [{ tag: "option", text: letter }];

    createElements(optionElements, selectElementTree.children[0]);
  });

  selectElementTree.children[0].addEventListener("change", (event) => {
    filterByStartingLetter(event, rootElement, originalProducts);
  });
}

function filterByStartingLetter(event, rootElement, originalProducts) {
  event.preventDefault();
  const selectedOption = event.target.value;

  const filteredAlbums = originalProducts.filter((product) =>
    product.name.startsWith(selectedOption)
  );

  [...rootElement.children].forEach((child) => {
    if (!child.matches("#price-search-form, select")) {
      rootElement.removeChild(child);
    }
  });

  filteredAlbums.forEach((product) => {
    const productElements = [
      { tag: "h1", text: `Album name: ${product.name}` },
      { tag: "h2", text: `Status: ${product.status}` },
      { tag: "h3", text: `Price: ${product.price}` },
    ];
    const productElementTree = createElements(productElements);
    productSubDetails(productElementTree.parent, product);
    rootElement.appendChild(productElementTree.parent);
  });
}

function createElements(elements, parentContainer) {
  let parent = parentContainer
    ? parentContainer
    : document.createElement("div");

  const children = [];

  elements.forEach(({ tag, text }) => {
    const child = document.createElement(tag);
    child.textContent = text;
    parent.appendChild(child);
    children.push(child);
  });

  return { parent, children };
}

window.addEventListener("load", loadEvent);
